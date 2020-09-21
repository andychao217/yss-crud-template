import { getIssuersList, updateIssuers, addIssuers, deleteIssuers, auditIssuers, reAuditIssuers } from '../services/index';
import { message } from 'antd';
/**
 * 页面说明
 */
export default {
	/***获取列表 *******/
	async httpGetIssuersList(state, { params }, { mutations, getState }) {
		try {
			let query = {
				...state.get('queryIssuersList').toJS(),
			};
			let result = await getIssuersList(query);
			const { data, winRspType, msg } = result;
			if (winRspType === 'SUCC') {
				state = getState();
				return state.merge({
					issuersList: data.list,
					issuersListTotal: data.total,
				});
			} else {
				message.error(msg);
			}
		} catch (error) {
			console.error(error);
		}
	},
	/***新增*******/
	async httpAddIssuers(state, { params }, { mutations }) {
		let result = await addIssuers(params);
		const { winRspType, msg } = result;
		if (winRspType === 'SUCC') {
			message.success('新增成功');
			await mutations.asyncHttpGetIssuersList({});
		} else {
			message.error(msg);
		}
	},
	/***修改*******/
	async httpUpdateIssuers(state, { params }, { mutations }) {
		let result = await updateIssuers(params);
		const { winRspType, msg } = result;
		if (winRspType === 'SUCC') {
			message.success('修改成功');
			await mutations.asyncHttpGetIssuersList({});
		} else {
			message.error(msg);
		}
	},
	/***删除*******/
	async httpDeleteIssuers(state, { params }, { mutations }) {
		let result = await deleteIssuers(params);
		const { winRspType, msg } = result;
		if (winRspType === 'SUCC') {
			message.success('删除成功');
			await mutations.asyncHttpGetIssuersList({});
		} else {
			message.error(msg);
		}
	},
	/***审核******/
	async httpAuditIssuers(state, { params }, { mutations }) {
		let result = await auditIssuers(params);
		const { winRspType, msg } = result;
		if (winRspType === 'SUCC') {
			message.success('审核成功');
			await mutations.asyncHttpGetIssuersList({});
		} else {
			message.error(msg);
		}
	},
	/***反审核*******/
	async httpReauditIssuers(state, { params, type }, { mutations }) {
		let result = await reAuditIssuers(params);
		const { winRspType, msg } = result;
		if (winRspType === 'SUCC') {
			message.success('反审核成功');
			await mutations.asyncHttpGetIssuersList({});
		} else {
			message.error(msg);
		}
	},
};
