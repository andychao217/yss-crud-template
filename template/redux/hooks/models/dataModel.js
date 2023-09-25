/**
 * @file 页面state初始化配置
 * @author $AuthorName
 * @copyright Ysstech
 */
import { page } from 'yss-trade-base';

const initialState = {
	TableList: [], //主列表
	TableListTotal: 0, //主列表数据总数
	//获取主列表入参
	queryTableList: {
		...page,
		reqPageSize: 50,
	},
	/***弹框status*/
	isOpenFormModal: {
		page: '$pageClassName',
		type: 'add', //add, update, delete, import, log
		status: false,
	},
	/**保存主列表当前选择行信息*/
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
