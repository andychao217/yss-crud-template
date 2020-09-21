import { page } from 'yss-trade-base';
//TODO
export default {
	issuersList: [], //列表
	issuersListTotal: 0,
	//获取列表
	queryIssuersList: {
		...page,
		publisherCodeOrName: '',
	},
	/***弹框status*/
	isOpenFormModal: {
		page: 'issuers',
		type: 'add', //add, update, delete, import, check
		status: false,
	},

	/**保存选择行信息*/
	projectRowed: {},
	issuersDropdownList: [], //下拉框
};
