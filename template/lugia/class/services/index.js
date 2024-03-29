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

/**form表单服务配置 */
export const formServiceConfig = {
	// 债券模糊查询
	TableListByName: {
		url: `/dfbp-riskcontrol-data/jcBondBaseInfo/pageList/forFront`,
		params: { reqPageNum: 1, reqPageSize: 20 },
		method: 'POST',
		option: {
			label: 'securitySname',
			value: 'interCode',
		},
		fullLabel: true,
		resName: 'securityCodeOrName',
	},

	// 交易市场模糊查询
	tradeMarketList: {
		url: `/dfbp-base-manage/tradeMarket/list`,
		params: { reqPageNum: 1, reqPageSize: 100 },
		method: 'POST',
		option: {
			label: 'marketName',
			value: 'marketCode',
		},
		// resName: 'marketCodes',
	},
	// 评级机构下拉列表
	ratingAgenciesListByNameOrCode: {
		url: `/dfbp-riskcontrol-data/zxBondCreditRate/getRatingAgencies`,
		params: { limitNum: 200 },
		method: 'POST',
		option: {
			label: 'compName',
			value: 'compCode',
		},
		fullLabel: true,
		resName: 'rateParam',
	},
};
