/**
 * @file 异步请求地址配置文件
 * @author $AuthorName
 * @copyright Ysstech
 */
import { $ajax } from 'yss-trade-base';
import { serviceMap } from '@/page/public-tools';
import { service } from 'win-trade-base';

const api = serviceMap['bizCommon'];

/***获取列表数据*******/
export const getListData = (params) => {
	return service.httpService({
		baseURL: `${api}`,
		url: '/pageList',
		method: 'post',
		data: params,
	});
};

/***新增*******/
export const addRowData = (params) => {
	return service.httpService({
		baseURL: `${api}`,
		url: '/save',
		method: 'post',
		data: params,
	});
};

/***修改*******/
export const updateRowData = (params) => {
	return service.httpService({
		baseURL: `${api}`,
		url: '/updateById',
		method: 'put',
		data: params,
	});
};

/***删除*******/
export const deleteRowData = (params) => {
	return service.httpService({
		baseURL: `${api}`,
		url: `/deleteById/${params}`,
		method: 'delete',
		data: params,
	});
};

/***审核*******/
export const auditRowData = (params) => {
	return service.httpService({
		baseURL: `${api}`,
		url: `/updateAudit/${params}`,
		method: 'put',
		data: params,
	});
};

/***反审核*******/
export const reAuditRowData = (params) => {
	return service.httpService({
		baseURL: `${api}`,
		url: `/updateRevertAudit/${params}`,
		method: 'put',
		data: params,
	});
};
