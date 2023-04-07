export * from './mainServices';

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
