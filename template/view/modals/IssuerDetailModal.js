import React, { PureComponent } from 'react';
import { message } from 'antd';
import { setFieldsObject, filterNullElement, NormalForm } from 'yss-trade-base';
import '../../../public-tools/style.css';
import { formServiceConfig } from '../../services';

class IssuerDetailModal extends PureComponent {
	state = {
		publisherName: '',
	};

	render() {
		const { isOpenFormModal } = this.props;
		const disabled = isOpenFormModal.type !== 'add';
		const disabledOptions = isOpenFormModal.type === 'delete' || isOpenFormModal.type === 'check';

		let _this = this;
		/*弹出form 表单的属性***/
		const formItems = [
			{
				name: 'publisherCode',
				label: '发行人',
				itemSize: '635px',
				type: 'Select',
				rules: [
					{
						required: true,
						message: '发行人代码不能为空',
					},
				],
				props: {
					config: formServiceConfig,
					type: 'publisher',
					allowClear: true,
					placeholder: '请选择发行人',
					disabled,
					onChange(value, option) {
						let publisherName = option?.props?.datas?.compName;
						_this.setState({
							publisherName,
						});
					},
				},
			},
			{
				type: 'Line',
				hidden: true,
			},
			{
				name: 'shortTerm',
				label: '短期',
				type: 'SelectMapDics',
				rules: [
					{
						required: true,
						message: '短期不能为空',
					},
				],
				props: {
					code: 'B10120000',
					placeholder: '请选择短期类型',
					disabled: disabledOptions,
				},
			},
			{
				name: 'longTerm',
				label: '长期',
				type: 'SelectMapDics',
				rules: [
					{
						required: true,
						message: '长期不能为空',
					},
				],
				props: {
					code: 'B10120000',
					placeholder: '请选择长期期类型',
					disabled: disabledOptions,
				},
			},
			{
				name: 'sustainable',
				label: '永续',
				type: 'SelectMapDics',
				rules: [
					{
						required: true,
						message: '永续不能为空',
					},
				],
				props: {
					code: 'B10120000',
					placeholder: '请选择永续类型',
					disabled: disabledOptions,
				},
			},
		];
		return (
			<NormalForm
				refs={(ref) => (this.createProduct = ref)}
				labelSize="5em"
				itemSize="165px"
				lineOf={3}
				marginRight="0px"
				formItem={formItems}
			/>
		);
	}

	UNSAFE_componentWillMount() {}

	componentDidMount() {
		const { isOpenFormModal, projectRowed } = this.props;
		this.props.onRef(this);
		//表单初始化
		this.createProduct.setValues({
			...setFieldsObject(projectRowed, isOpenFormModal.type),
		});
	}

	//点击确定进行增加修改操作
	handleSubmit(e) {
		const { asyncHttpAddIssuers, asyncHttpUpdateIssuers, asyncHttpDeleteIssuers, projectRowed, changeSync, isOpenFormModal } = this.props;
		e.preventDefault();
		this.createProduct.onValidate(
			(values) => {
				const action = {
					add: asyncHttpAddIssuers, //新增
					update: asyncHttpUpdateIssuers, //修改
					delete: asyncHttpDeleteIssuers, //删除
				};
				//获取参数
				let params = {
					add: { ...values, publisherName: this.state.publisherName },
					delete: [projectRowed.id],
					update: {
						...values,
						id: isOpenFormModal.type !== 'add' ? projectRowed.id : undefined,
					},
				};
				//关闭modal
				changeSync({
					isOpenFormModal: {
						type: 'add',
						status: false,
					},
				});
				//提交请求
				action[isOpenFormModal.type]({
					params: filterNullElement(params[isOpenFormModal.type]),
				}).then(() => {
					//
				});
				// 清除选中项的数据
				changeSync({
					projectRowed: {},
				});
			},
			(err) => {
				console.log(err);
				message.error('请按要求填写信息');
			}
		);
	}
}
export default IssuerDetailModal;
