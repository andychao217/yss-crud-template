import { $ajax } from 'yss-trade-base';

/***获取列表*******/
export const getTableList = (params) => $ajax(`/dfbp-riskcontrol-data/jcPublisherGroupRelation/pageList/vague`, params, 'post');

/***新增*******/
export const addTable = (params) => $ajax(`/dfbp-riskcontrol-data/jcPublisherGroupRelation/save`, params, 'post');
/***修改*******/
export const updateTable = (params) => $ajax(`/dfbp-riskcontrol-data/jcPublisherGroupRelation/updateById`, params, 'put');
/***删除*******/
export const deleteTable = (params) => $ajax(`/dfbp-riskcontrol-data/jcPublisherGroupRelation/deleteByIds/${params}`, 'delete', 'delete');

/***审核*******/
export const auditTable = (params) => $ajax(`/dfbp-riskcontrol-data/jcPublisherGroupRelation/updateAudit/${params}`, params, 'put');
/***反审核*******/
export const reAuditTable = (params) => $ajax(`/dfbp-riskcontrol-data/jcPublisherGroupRelation/updateRevertAudit/${params}`, params, 'put');

/***导入*******/
export const importTable = (params) => $ajax(`/dfbp-riskcontrol-data/jcPublisherGroupRelation/excel/import`, params, 'post');
/***下载Excel模板 *******/
export const downloadTableTemplate = `/dfbp-riskcontrol-data/jcPublisherGroupRelation/excel/export/temp`;

/**form表单服务配置 */
export const formServiceConfig = {
	//下拉框列表
	publisher: {
		url: `/dfbp-riskcontrol-data/jcPublisherGroupRelation/publisher/listByCode`,
		option: {
			value: 'compCode',
			label: 'compName',
		},
		params: {
			limitNum: 20,
		},
		method: 'post',
		fullLabel: true,
		resName: 'publisherCodeOrName',
	},
};
