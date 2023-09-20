/**
 * @file 弹框内容组件
 * @author $AuthorName
 * @copyright Ysstech
 */
import React, { PureComponent } from 'react';
import moment from 'moment';
import { message } from 'antd';
import { setFieldsObject, filterNullElement, NeatForm, NormalForm } from 'yss-trade-base';
import { formServiceConfig, addRowData, updateRowData, getListData } from '../../services';
const { mapOption } = NormalForm;

/**
 * @class
 * @classdesc 弹框内容
 */
class DetailModal extends PureComponent {
	state = {};

	componentDidMount() {
		const { isOpenFormModal, projectRowed } = this.props;
		this.props.onRef(this);
		this.createProduct.setValues({
			...setFieldsObject(projectRowed, isOpenFormModal.type),
		});
	}

	//点击确定进行增加修改操作
	handleSubmit(e) {
		const { asyncHttpGetListData, projectRowed, changeSync, isOpenFormModal, TableList } = this.props;
		e.preventDefault();
		this.createProduct.onValidate(
			(values) => {
				const action = {
					add: addRowData,
					update: updateRowData,
				};
				let params = {
					add: { ...values},
					update: {
						...values,
						id: isOpenFormModal.type !== 'add' ? projectRowed.id : undefined,
					},
				};
				action[isOpenFormModal.type](filterNullElement(params[isOpenFormModal.type])).then((res) => {
					if (res.code !== '200') {
						message.error(res.msg);
						return;
					}
					changeSync({
						isOpenFormModal: {
							type: 'add',
							status: false,
						},
						projectRowed: {},
					});
					if (isOpenFormModal.type === 'add') {
						asyncHttpGetListData({ params: { resetPage: true } });
						this.props.clearSelectedRows();
					} else {
						//修改更新单独一行
						getListData({ id: projectRowed.id, reqPageSize: 50, reqPageNum: 1 }).then((res) => {
							if (res.code !== '200') {
								message.error(res.msg);
								return;
							}
							if (res.data && res.data.list && res.data.list.length) {
								const newRowData = { ...res.data.list[0] };
								const newTableList = TableList.map((item) => {
									if (item.id === newRowData.id) {
										return {
											...item,
											...newRowData,
										};
									} else {
										return item;
									}
								});
								changeSync({
									projectRowed: newRowData,
									TableList: newTableList,
								});
							}
						});
					}
				});
			},
			(err) => {
				console.log(err);
				message.error('请按要求填写信息');
			},
		);
	}

	render() {
		const { isOpenFormModal } = this.props;
		const showdetails = isOpenFormModal.type === 'detail';
		let _this = this;
		/*弹出form 表单的属性***/
		const formItems = [
			{
				name: 'securityCode',
				label: '债券代码',
				type: 'Select',
				rules: [
					{
						required: true,
						message: '债券代码不能为空',
					},
				],
				props: {
					placeholder: '请选择债券',
					type: 'TableListByName',
					config: formServiceConfig,
					disabled: isOpenFormModal.type !== 'add',
					dropDownStyle: {
						maxHeight: '400px',
					},
					dropdownMatchSelectWidth: false,
					getPopupContainer: () => document.getElementById('$PageNameDetailModal'),
					allowClear: true,
				},
			},
			{
				name: 'marketCode',
				label: '债券市场',
				type: 'Select',
				rules: [
					{
						required: true,
						message: '债券市场不能为空',
					},
				],
				props: {
					placeholder: '请选择债券市场',
					type: 'tradeMarketList',
					config: formServiceConfig,
					allowClear: true,
					disabled: true,
					dropDownStyle: {
						maxHeight: '400px',
					},
					dropdownMatchSelectWidth: false,
					getPopupContainer: () => document.getElementById('$PageNameDetailModal'),=
				},
			},
			{
				name: 'creditDate',
				label: '评级日期',
				type: 'DatePicker',
				rules: [
					{
						required: true,
						message: '不能为空',
					},
				],
				props: {
					disabled: showdetails,
					placeholder: '请选择日期',
					initialValue: moment(),
					getCalendarContainer: () => document.getElementById('$PageNameDetailModal'),
				},
			},
			{
				name: 'exptRating',
				label: '评级展望',
				type: 'SelectMapDics',
				rules: [
					{
						required: false,
						message: '不能为空',
					},
				],
				props: {
					code: 'B10170000',
					allowClear: true,
					placeholder: '请选择评级展望',
					disabled: showdetails,
					onChange(value) {},
				},
			},
			{
				name: 'externalFlag',
				label: '外部评级',
				type: 'SelectMapDics',
				rules: [
					{
						required: false,
						message: '不能为空',
					},
				],
				props: {
					code: 'C10010000',
					allowClear: true,
					placeholder: '请选择是否外部评级',
					disabled: showdetails,
				},
			},
			{
				type:'Blank',
			}
		];
		return (
			<div id='$PageNameDetailModal'>
				<NeatForm
					refs={(ref) => (this.createProduct = ref)}
					labelSize='100px'
					lineOf={2}
					formItem={formItems}
					viewing={isOpenFormModal.type === 'detail' ? true : false}
				/>
			</div>
		);
	}
}
export default DetailModal;
