/**
 * @file 页面state初始化配置
 * @author Andy Chao <zhaoqing@ysstech.com>
 * @copyright Ysstech
 */
import { page } from 'yss-trade-base';

export default {
	TableLits: [], //债券列表
	TableLitsTotal: 0,
	//获取债券列表
	queryTableLits: {
		...page,
		startDate: null,
		endDate: null,
	},
	/***弹框status*/
	isOpenFormModal: {
		page: '$PageName',
		type: 'add', //add, update, delete, import
		status: false,
	},
	/**保存选择行信息*/
	projectRowed: {},
};
