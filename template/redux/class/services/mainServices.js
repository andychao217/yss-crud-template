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
export const getListData = (params) => $ajax(`${api}/pageList`, params, 'post');

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
export const deleteRowData = (params) => $ajax(`${api}/deleteById/${params}`, params, 'delete');

/***审核*******/
export const auditRowData = (params) => $ajax(`${api}/updateAudit/${params}`, params, 'put');

/***反审核*******/
export const reAuditRowData = (params) => $ajax(`${api}/updateRevertAudit/${params}`, params, 'put');

//获取长期/短期评级下拉框
export const getcreditRateDropdownList = (params) =>
	$ajax(`/dfas-base-biz/dics/listAllSub`, params, 'POST', {
		mask: false,
	});
