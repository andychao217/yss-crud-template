import { $ajax } from 'yss-trade-base';

const api =
	process.env.NODE_ENV === 'development' ? '/dfbp-riskcontrol-data/jcPublisherGroupRelation' : '/dfbp-riskcontrol-data/jcPublisherGroupRelation';

/***获取列表*******/
export const getIssuersList = (params) => $ajax(`${api}/pageList/vague`, params, 'post');

/***新增*******/
export const addIssuers = (params) => $ajax(`${api}/save`, params, 'post');
/***修改*******/
export const updateIssuers = (params) => $ajax(`${api}/updateById`, params, 'put');
/***删除*******/
export const deleteIssuers = (params) => $ajax(`${api}/deleteByIds/${params}`, 'delete', 'delete');

/***审核*******/
export const auditIssuers = (params) => $ajax(`${api}/updateAudit/${params}`, params, 'put');
/***反审核*******/
export const reAuditIssuers = (params) => $ajax(`${api}/updateRevertAudit/${params}`, params, 'put');

/***导入*******/
export const importIssuers = (params) => $ajax(`${api}/excel/import`, params, 'post');
/***下载Excel模板 *******/
export const downloadIssuersTemplate = `${api}/excel/export/temp`;

/**form表单服务配置 */
export const formServiceConfig = {
	//下拉框列表
	publisher: {
		url: `${api}/publisher/listByCode`,
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
