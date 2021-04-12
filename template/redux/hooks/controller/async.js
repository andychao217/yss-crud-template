/**
 * @file 异步请求函数文件
 * @author $AuthorName
 * @copyright Ysstech
 */
import {
	getListData,
	addRowData,
	updateRowData,
	deleteRowData,
	auditRowData,
	reAuditRowData,
	getcreditRateDropdownList
} from '../services/index';
import { model } from '../models';
import { UpdateStore } from '../models/actions';
import { message } from 'antd';

/**
 * @async
 * @function - 获取列表数据
 * @param {object} queryTableList - 查询列表条件
 * @return {Promise<object>} TableList - 列表数据, TableListTotal - 列表数据总条数
 */
export const httpGetListData = async () => {
	try
	{
		const state = model.getState().pageReducer;
		let result = await getListData(state['queryTableList']);
		const { data, winRspType, msg } = result;
		if (winRspType === 'SUCC') {
			const res = {
				TableList: data.list,
				TableListTotal: data.total,
			};
			model.dispatch(UpdateStore(res));
		} else {
			message.error(msg);
		}
	} catch (error) {
		console.error(error);
	}
};

/**
 * @async
 * @function - 新增列表数据
 * @param {object} params - 新增列表参数
 * @return {Promise<void>} - 调用获取列表数据函数
 */
export const httpAddRowData =  async (params) => {
	let result = await addRowData(params);
	const { winRspType, msg } = result;
	if (winRspType === 'SUCC') {
		message.success('新增成功');
		httpGetListData();
	} else {
		message.error(msg);
	}
};

/**
 * @async
 * @function - 修改列表数据
 * @param {object} params - 修改行数据参数，包括id，其余参数同新增
 * @return {Promise<void>} - 调用获取列表数据函数
 */
export const httpUpdateRowData = async (params) => {
	let result = await updateRowData(params);
	const { winRspType, msg } = result;
	if (winRspType === 'SUCC') {
		message.success('修改成功');
		httpGetListData();
	} else {
		message.error(msg);
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
		message.success('删除成功');
		httpGetListData();
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
		message.success('审核成功');
		httpGetListData();
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
		message.success('反审核成功');
		httpGetListData();
	} else {
		message.error(msg);
	}
};

/***获取长期/短期评级下拉框 *******/
export const httpGetCreditRateDropdownList = async (params) => {
	try {
		let result = await getcreditRateDropdownList(params);
		const { data, winRspType, msg } = result;
		if (winRspType === 'SUCC') {
			let creditRateDropdownList = data.map((item) => {
				return {
					value: item.dicCode,
					label: item.dicExplain,
				};
			});
			model.dispatch(UpdateStore({creditRateDropdownList}));
		} else {
			message.error(msg);
		}
	} catch (error) {
		console.error(error);
	}
};
