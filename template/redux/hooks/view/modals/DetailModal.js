/**
 * @file 弹框内容组件
 * @author $AuthorName
 * @copyright Ysstech
 */
import React, { useEffect, useState, useImperativeHandle, forwardRef, useContext } from 'react';
import moment from 'moment';
import { message } from 'antd';
import { setFieldsObject, filterNullElement, NeatForm, NormalForm, PublicProps } from 'yss-trade-base';
import { formServiceConfig, addRowData, updateRowData, getListData } from '../../services';
import { httpGetListData } from '../../controller/mainAsync';
const { mapOption } = NormalForm;

/**
 * @class
 * @classdesc 弹框内容
 */
let createProduct = null;
const DetailModal = (props, ref) => {
	useImperativeHandle(ref, () => ({
		//  暴露给父组件的方法
		handleSubmit: handleSubmit,
	}));
	const { isOpenFormModal, projectRowed, dispatchUpdateStore, TableList } = useContext(PublicProps);
	const showdetails = isOpenFormModal.type === 'detail';

	useEffect(() => {
		props.onRef(this);
		createProduct.setValues({
			...setFieldsObject(projectRowed, isOpenFormModal.type),
		});
	}, []);

	//点击确定进行增加修改操作
	const handleSubmit = () => {
		// e.preventDefault();
		createProduct.onValidate(
			(values) => {
				const action = {
					add: addRowData,
					update: updateRowData,
				};
				let params = {
					add: { ...values },
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
					dispatchUpdateStore({
						isOpenFormModal: {
							type: 'add',
							status: false,
						},
						projectRowed: {},
					});
					if (isOpenFormModal.type === 'add') {
						httpGetListData(true);
						props.clearSelectedRows();
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
								dispatchUpdateStore({
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
	};

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
				type: 'BondListByName',
				config: formServiceConfig,
				disabled: isOpenFormModal.type !== 'add',
				allowClear: true,
				dropDownStyle: {
					maxHeight: '400px',
				},
				dropdownMatchSelectWidth: false,
				getPopupContainer: () => document.getElementById('$pageClassNameDetailModal'),
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
				getPopupContainer: () => document.getElementById('$pageClassNameDetailModal'),
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
				getCalendarContainer: () => document.getElementById('$pageClassNameDetailModal'),
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
			type: 'Blank',
		},
	];

	return (
		<div id='$pageClassNameDetailModal'>
			<NeatForm
				refs={(ref) => (createProduct = ref)}
				labelSize='100px'
				lineOf={2}
				formItem={formItems}
				viewing={isOpenFormModal.type === 'detail' ? true : false}
			/>
		</div>
	);
};

export default forwardRef(DetailModal);
