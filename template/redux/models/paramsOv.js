import { page } from 'yss-trade-base';

const initialState = {
	bondList: [], //债券列表
	bondListTotal: 0,
	//获取债券列表
	queryBondList: {
		...page,
		startDate: null,
		endDate: null,
	},
	/***弹框status*/
	isOpenFormModal: {
		page: 'bond',
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
}

export default pageReducer;
