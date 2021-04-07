/**
 * @file 页面state初始化配置
 * @author Andy Chao <zhaoqing@ysstech.com>
 * @copyright Ysstech
 */
import { page } from 'yss-trade-base';

export default {
	TableList: [], //债券列表
	TableListTotal: 0,
	//获取债券列表
	queryTableList: {
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
	/**点击新增、修改弹框确定按钮*/
	modalOnOk: false,
};
