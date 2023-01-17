/**
 * @file 页面state初始化配置
 * @author $AuthorName
 * @copyright Ysstech
 */
import { page } from 'yss-trade-base';

const initialState = {
	TableList: [], //列表
	TableListTotal: 0,
	//获取列表
	queryTableList: {
		...page,
		startDate: null,
		endDate: null,
		reqPageSize: 50,
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

const pageReducer = (state = initialState, action) => {
	switch (action.type) {
		case 'UPDATE_STORE':
			return {
				...state,
				...action.params,
			};
		default:
			return state;
	}
};

export default pageReducer;
