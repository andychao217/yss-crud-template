/**
 * @file 异步请求地址配置文件
 * @author $AuthorName
 * @copyright Ysstech
 */
import { serviceMap } from '@/page/public-tools';
import { serviceFn } from '@/front-biz';

const api = serviceMap['bizCommon'];

/***获取列表数据*******/
export const getListData = (params) => {
	return serviceFn(api, '/pageList', 'post', params);
};

/***新增*******/
export const addRowData = (params) => {
	return serviceFn(api, '/save', 'post', params);
};

/***修改*******/
export const updateRowData = (params) => {
	return serviceFn(api, '/updateById', 'put', params);
};

/***删除*******/
export const deleteRowData = (params) => {
	return serviceFn(api, `/deleteById/${params}`, 'delete', params);
};

/***审核*******/
export const auditRowData = (params) => {
	return serviceFn(api, `/updateAudit/${params}`, 'put', params);
};

/***反审核*******/
export const reAuditRowData = (params) => {
	return serviceFn(api, `/updateRevertAudit/${params}`, 'put', params);
};
