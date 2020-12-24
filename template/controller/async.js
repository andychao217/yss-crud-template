import { 
	getTableList, 
	updateTable, 
	addTable, 
	deleteTable, 
	auditTable, 
	reAuditTable 
} from '../services/index';
import { message } from 'antd';
/**
 * 页面说明
 */
export default {
	/***获取列表 *******/
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
	/***新增*******/
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
	/***修改*******/
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
	/***删除*******/
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
	/***审核******/
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
	/***反审核*******/
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
