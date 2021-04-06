/**
 * @file 异步请求函数文件
 * @author Andy Chao <zhaoqing@ysstech.com>
 * @copyright Ysstech
 */
import { 
	getTableList, 
	updateTable, 
	addTable, 
	deleteTable, 
	auditTable, 
	reAuditTable 
} from '../services/index';
import { message } from 'antd';

export default {
	/**
	 * @async
	 * @function - 获取列表数据
	 * @param {object} queryTableList - 查询列表条件
	 * @return {Promise<object>} TableList - 列表数据, TableListTotal - 列表数据总条数
	 */
	async httpGetTableList(state, { params }, { mutations, getState }) {
		try {
			let query = {
				...state.get('queryTableList').toJS(),
			};
			let result = await getTableList(query);
			const { data, winRspType, msg } = result;
			if (winRspType === 'SUCC') {
				state = getState();
				return state.merge({
					TableList: data.list,
					TableListTotal: data.total,
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
	 * @function - 新增列表数据
	 * @param {object} 新增列表参数
	 * @return {Promise<void>} 调用获取列表数据函数
	 */
	async httpAddTable(state, { params }, { mutations }) {
		let result = await addTable(params);
		const { winRspType, msg } = result;
		if (winRspType === 'SUCC') {
			message.success('新增成功');
			await mutations.asyncHttpGetTableList({});
		} else {
			message.error(msg);
		}
	},
	/**
	 * @async
	 * @function - 修改列表数据
	 * @param {object} 修改行数据参数，包括id，其余参数同新增
	 * @return {Promise<void>} 调用获取列表数据函数
	 */
	async httpUpdateTable(state, { params }, { mutations }) {
		let result = await updateTable(params);
		const { winRspType, msg } = result;
		if (winRspType === 'SUCC') {
			message.success('修改成功');
			await mutations.asyncHttpGetTableList({});
		} else {
			message.error(msg);
		}
	},
	/**
	 * @async
	 * @function - 删除列表数据
	 * @param {string} 删除行数据id，批量已','分隔 
	 * @return {Promise<void>} 调用获取列表数据函数
	 */
	async httpDeleteTable(state, { params }, { mutations }) {
		let result = await deleteTable(params);
		const { winRspType, msg } = result;
		if (winRspType === 'SUCC') {
			message.success('删除成功');
			await mutations.asyncHttpGetTableList({});
		} else {
			message.error(msg);
		}
	},
	/**
	 * @async
	 * @function - 审核列表数据
	 * @param {string} 审核行数据id，批量已','分隔 
	 * @return {Promise<void>} 调用获取列表数据函数
	 */
	async httpAuditTable(state, { params }, { mutations }) {
		let result = await auditTable(params);
		const { winRspType, msg } = result;
		if (winRspType === 'SUCC') {
			message.success('审核成功');
			await mutations.asyncHttpGetTableList({});
		} else {
			message.error(msg);
		}
	},
	/**
	 * @async
	 * @function - 反审核列表数据
	 * @param {string} 反审核行数据id，批量已','分隔 
	 * @return {Promise<void>} 调用获取列表数据函数
	 */
	async httpReauditTable(state, { params, type }, { mutations }) {
		let result = await reAuditTable(params);
		const { winRspType, msg } = result;
		if (winRspType === 'SUCC') {
			message.success('反审核成功');
			await mutations.asyncHttpGetTableList({});
		} else {
			message.error(msg);
		}
	},
};
