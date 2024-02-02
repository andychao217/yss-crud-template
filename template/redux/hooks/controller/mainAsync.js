/**
 * @file 异步请求函数文件
 * @author $AuthorName
 * @copyright Ysstech
 */
import { getListData, deleteRowData, auditRowData, reAuditRowData } from '../services/index';
import { model } from '../models';
import { UpdateStore } from '../models/actions';
import { message } from 'antd';
import { filterNullElement } from 'yss-trade-base';

/**
 * @async
 * @function - 获取列表数据
 * @param {object} queryTableList - 查询列表条件
 * @return {Promise<object>} TableList - 列表数据, TableListTotal - 列表数据总条数
 */
export const httpGetListData = async (resetPage = false, callback = () => {}) => {
	try {
		const state = model.getState().pageReducer;
		let params = filterNullElement(state['queryTableList']);
		if (resetPage) {
			//刷新数据返回第一页
			params.reqPageNum = 1;
		}
		let result = await getListData(params);
		const { data, winRspType, msg } = result;
		if (winRspType === 'SUCC') {
			const newTableList = data?.list || [];
			const oldTableList = JSON.parse(JSON.stringify(state['TableList']));
			const tableList = Number(params?.reqPageNum) !== 1 ? [...oldTableList, ...newTableList] : newTableList;
			const res = {
				TableList: tableList || [],
				TableListTotal: data?.total || 0,
			};
			if (resetPage) {
				res.queryTableList = {
					...state['queryTableList'],
					reqPageNum: 1,
				};
			}
			model.dispatch(UpdateStore(res));
		} else {
			message.error(msg);
		}
		if (callback && typeof callback === 'function') {
			callback();
		}
		return new Promise((resolve) => {
			resolve(result);
		});
	} catch (error) {
		console.error(error);
		if (callback && typeof callback === 'function') {
			callback();
		}
	}
};

/**
 * @async
 * @function - 删除列表数据
 * @param {array} params - 删除行数据id，批量已','分隔
 * @return {Promise<void>} - 调用获取列表数据函数
 */
export const httpDeleteRowData = async (params) => {
	let result = await deleteRowData(params);
	const { winRspType, msg } = result;
	if (winRspType === 'SUCC') {
		if (msg) {
			message.success(msg);
		}
		httpGetListData(true);
	} else {
		message.error(msg);
	}
};

/**
 * @async
 * @function - 审核列表数据
 * @param {array} params - 审核行数据id，批量已','分隔
 * @return {Promise<void>} - 调用获取列表数据函数
 */
export const httpAuditRowData = async (params) => {
	let result = await auditRowData(params);
	const { winRspType, msg } = result;
	if (winRspType === 'SUCC') {
		if (msg) {
			message.success(msg);
		}
		httpGetListData(true);
	} else {
		message.error(msg);
	}
};

/**
 * @async
 * @function - 反审核列表数据
 * @param {array} params - 反审核行数据id，批量已','分隔
 * @return {Promise<void>} 调用获取列表数据函数
 */
export const httpReAuditRowData = async (params) => {
	let result = await reAuditRowData(params);
	const { winRspType, msg } = result;
	if (winRspType === 'SUCC') {
		if (msg) {
			message.success(msg);
		}
		httpGetListData(true);
	} else {
		message.error(msg);
	}
};
