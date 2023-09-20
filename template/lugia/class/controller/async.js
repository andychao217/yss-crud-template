/**
 * @file 异步请求函数文件
 * @author $AuthorName
 * @copyright Ysstech
 */
import { getListData, deleteRowData, auditRowData, reAuditRowData } from '../services/index';
import { message } from 'antd';

export default {
	/**
	 * @async
	 * @function - 获取列表数据
	 * @param {object} queryTableList - 查询列表条件
	 * @return {Promise<object>} TableList - 列表数据, TableListTotal - 列表数据总条数
	 */
	async httpGetListData(state, { params }, { mutations, getState }) {
		try {
			const queryTableList = state.get('queryTableList').toJS();
			let query = {
				...queryTableList,
			};
			if (params?.resetPage) {
				//刷新数据返回第一页
				query.reqPageNum = 1;
			}
			let result = await getListData(query);
			const { data, winRspType, msg } = result;
			if (winRspType === 'SUCC') {
				// 获取新的翻页器参数
				state = getState();
				const newTableList = data?.list || [];
				const oldTableList = state.get('TableList').toJS();
				const tableList = Number(query?.reqPageNum) !== 1 ? [...oldTableList, ...newTableList] : newTableList;
				let queryTableListState = { ...queryTableList };
				if (params?.resetPage) {
					queryTableListState.reqPageNum = 1;
				}
				// 获取新的翻页器参数
				return state.merge({
					TableList: tableList,
					TableListTotal: data?.total || 0,
					queryTableList: queryTableListState,
				});
			} else {
				message.error(msg);
			}
		} catch (error) {
			console.error(error);
		}
	},

	/**
	 * @async
	 * @function - 删除列表数据
	 * @param {array} 删除行数据id，批量已','分隔
	 * @return {Promise<void>} 调用获取列表数据函数
	 */
	async httpDeleteRowData(state, { params }, { mutations }) {
		let result = await deleteRowData(params);
		const { winRspType, msg } = result;
		if (winRspType === 'SUCC') {
			if (msg) {
				message.success(msg);
			}
			await mutations.asyncHttpGetListData({ params: { resetPage: true } });
		} else {
			message.error(msg);
		}
	},

	/**
	 * @async
	 * @function - 审核列表数据
	 * @param {array} 审核行数据id，批量已','分隔
	 * @return {Promise<void>} 调用获取列表数据函数
	 */
	async httpAuditRowData(state, { params }, { mutations }) {
		let result = await auditRowData(params);
		const { winRspType, msg } = result;
		if (winRspType === 'SUCC') {
			if (msg) {
				message.success(msg);
			}
			await mutations.asyncHttpGetListData({ params: { resetPage: true } });
		} else {
			message.error(msg);
		}
	},

	/**
	 * @async
	 * @function - 反审核列表数据
	 * @param {array} 反审核行数据id，批量已','分隔
	 * @return {Promise<void>} 调用获取列表数据函数
	 */
	async httpReAuditRowData(state, { params, type }, { mutations }) {
		let result = await reAuditRowData(params);
		const { winRspType, msg } = result;
		if (winRspType === 'SUCC') {
			if (msg) {
				message.success(msg);
			}
			await mutations.asyncHttpGetListData({ params: { resetPage: true } });
		} else {
			message.error(msg);
		}
	},
};
