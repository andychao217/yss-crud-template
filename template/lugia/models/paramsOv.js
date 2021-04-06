/**
 * @file 页面state初始化配置
 * @author Andy Chao <zhaoqing@ysstech.com>
 * @copyright Ysstech
 */
import { page } from 'yss-trade-base';
export default {
	TableList: [], //列表
	TableListTotal: 0,
	//获取列表
	queryTableList: {
		...page,
	},
	/***弹框status*/
	isOpenFormModal: {
		page: 'Table',
		type: 'add', //add, update, delete, import, check
		status: false,
	},
	/**保存选择行信息*/
	projectRowed: {},
	TableDropdownList: [], //下拉框
};
