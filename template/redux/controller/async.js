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

//获取数据列表
export const httpGetListData = async () => {
	try
	{
		const state = model.getState().pageReducer;
		let result = await getListData(state['queryBondList']);
		const { data, winRspType, msg } = result;
		if (winRspType === 'SUCC') {
			const res = {
				bondList: data.list,
				bondListTotal: data.total,
			};
			model.dispatch(UpdateStore(res));
		} else {
			message.error(msg);
		}
	} catch (error) {
		console.error(error);
	}
};

//新增数据
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

//修改数据
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

//删除数据
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

//审核数据
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

//反审核数据
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
