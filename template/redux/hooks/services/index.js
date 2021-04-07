/**
 * @file 异步请求地址配置文件
 * @author Andy Chao <zhaoqing@ysstech.com>
 * @copyright Ysstech
 */
import { $ajax } from 'yss-trade-base';

const api = '/dfbp-riskcontrol-data/zxBondCreditRate';

/***获取列表数据*******/
export const getListData = (params) => $ajax(`${api}/pageList`, params, 'post');

/***新增*******/
export const addRowData = (params) => $ajax(`${api}/save`, params, 'post');

/***修改*******/
export const updateRowData = (params) => $ajax(`${api}/updateById`, params, 'put');

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

/**form表单服务配置 */
export const formServiceConfig = {
	// 债券模糊查询
	BondListByName: {
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
