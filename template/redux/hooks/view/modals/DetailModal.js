/**
 * @file 弹框内容组件
 * @author $AuthorName
 * @copyright Ysstech
 */
import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { message } from 'antd';
import {
	setFieldsObject,
	filterNullElement,
	NeatForm,
	NormalForm,
} from 'yss-trade-base';
import { formServiceConfig } from '../../services';
import {
	httpGetCreditRateDropdownList,
	httpAddRowData,
	httpUpdateRowData,
} from '../../controller/async';
const { mapOption } = NormalForm;

/**
 * @class
 * @classdesc 弹框内容
 */
let createProduct = null;
const DetailModal = (props) => {
	const {
		isOpenFormModal,
		creditRateDropdownList,
		modalOnOk,
	} = props;
	const showdetails = isOpenFormModal.type === 'detail';
	const [rateCompName, setRateCompName] = useState(undefined);

	useEffect(() => {
		const {
			isOpenFormModal,
			projectRowed,
		} = props;
		props.onRef(this);
		//表单初始化
		if (projectRowed.rateType != null) {
			async function fetchData() {
				let value = projectRowed.rateType
				let parentDicCode = '';
				if ('10090001' === value) {
					// 长期信用评级  10090001-B10100000
					parentDicCode = 'B10100000';
				}
				if ('10090002' === value) {
					// 短期信用评级  10090002-B10110000
					parentDicCode = 'B10110000';
				}
				await httpGetCreditRateDropdownList(
					{ parentDicCode }
				);
			}
			fetchData();
		}

		createProduct.setValues({
			...setFieldsObject(projectRowed, isOpenFormModal.type),
			creditDate: projectRowed.creditDate ? moment(projectRowed.creditDate) : null,
		});
		createProduct.setValues({
			marketCode: projectRowed.marketCode,
		});
	}, []);

	useEffect(() => {
		if (modalOnOk) {
			handleSubmit();
		}
	},[modalOnOk])

	//点击确定进行增加修改操作
	const handleSubmit = () => {
		const {
			projectRowed,
			dispatchUpdateStore,
			isOpenFormModal
		} = props;
		// e.preventDefault();
		createProduct.onValidate(
			(values) => {
				const action = {
					add: httpAddRowData,
					update: httpUpdateRowData,
				};
				values.creditDate = moment(values.creditDate).format('YYYYMMDD');
				const securityCode = values?.securityCode?.split('.')[0];
				let params = {
					add: { ...values, rateCompName, securityCode },
					update: {
						...values,
						rateCompName: rateCompName || projectRowed.rateCompName,
						id: isOpenFormModal.type !== 'add' ? projectRowed.id : undefined,
					},
				};
				action[isOpenFormModal.type](
					filterNullElement(params[isOpenFormModal.type])
				).then(() => {
					dispatchUpdateStore({
						isOpenFormModal: {
							type: 'add',
							status: false,
						},
						projectRowed: {},
						modalOnOk: false,
					});
				});
			},
			(err) => {
				console.log(err);
				message.error('请按要求填写信息');
				dispatchUpdateStore({
					modalOnOk: false,
				});
			}
		);
	}

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
				onChange(value, option) {
					if (value) {
						createProduct.setValues({
							marketCode: option?.props?.datas?.marketCode,
						});
					}
				},
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
				onChange(value) { },
			},
		},
		{
			name: 'rateType',
			label: '评级类型',
			type: 'SelectMapDics',
			rules: [
				{
					required: true,
					message: '不能为空',
				},
			],
			props: {
				code: 'B10090000',
				allowClear: true,
				placeholder: '请选择评级类型',
				disabled: showdetails,
				onChange(value) {
					let parentDicCode = '';
					if ( value === '10090001') {
						// 长期信用评级  10090001-B10100000
						parentDicCode = 'B10100000';
					} else if (value === '10090002') {
						// 短期信用评级  10090002-B10110000
						parentDicCode = 'B10110000';
					}
					async function fetchData() {
						await httpGetCreditRateDropdownList(
							{ parentDicCode }
						);
					}
					fetchData();
					createProduct.setValues({
						creditRate: null,
					});
				},
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
				onChange(value) {
				},
			},
		},
		{
			name: 'creditRate',
			label: '信用评级',
			type: 'Select',
			rules: [
				{
					required: true,
					message: '不能为空',
				},
			],
			options: mapOption(creditRateDropdownList, 'label', 'value'),
			props: {
				allowClear: true,
				placeholder: '请选择信用评级',
				disabled: showdetails,
				onChange(value) { },
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
				onChange(value) { },
			},
		},
		{
			name: 'rateCompCode',
			label: '评级机构',
			type: 'Select',
			rules: [
				{
					required: true,
					message: '不能为空',
				},
			],
			props: {
				placeholder: '请选择评级机构',
				type: 'ratingAgenciesListByNameOrCode',
				config: formServiceConfig,
				disabled: showdetails,
				allowClear: true,
				onChange(value, obj) {
					if (obj) {
						setRateCompName(obj?.props?.datas?.compName);
					}
				},
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
	];

	return (
		<NeatForm
			refs={(ref) => (createProduct = ref)}
			labelSize='100px'
			lineOf={2}
			formItem={formItems}
			viewing={isOpenFormModal.type === 'detail' ? true : false}
		/>
	);
}

export default DetailModal;
