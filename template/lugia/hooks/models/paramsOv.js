/**
 * @file 页面state初始化配置
 * @author $AuthorName
 * @copyright Ysstech
 */
import { page } from 'yss-trade-base';

export default {
	TableList: [], //列表
	TableListTotal: 0,
	//获取列表
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
};
