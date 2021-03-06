/**
 * @file 数据表格组件
 * @author $AuthorName
 * @copyright Ysstech
 */
import React, { useState, useEffect, Fragment } from 'react';
import moment from 'moment';
import { columnsCfg } from '../../models/columnConfig';
import {
	ConfigableTable,
	setColumns,
	setTableInfo,
	withRoleBotton,
	rowSelectionFunc,
	Modal,
	ConfirmModal,
	withRoleTableBotton,
	SearchForm,
} from 'yss-trade-base';
import DetailModal from '../modals/DetailModal';
import { formServiceConfig } from '../../services';

/**
 * @class
 * @classdesc 数据表格
 */
const MainTable = (props) => {
	const {
		asyncHttpGetListData,
		asyncHttpDeleteRowData,
		asyncHttpAuditRowData,
		asyncHttpReAuditRowData,
		changeSync,
		queryTableList,
		TableList,
		TableListTotal,
		isOpenFormModal,
	} = props;
	const _this = this;
	const [ids, setIds] = useState([]); //选择行id
	const [selectedRows, setSelectedRows] = useState([]); //选择行内容
	const [disableButton, setDisableButton] = useState(true); //页面Toolbar按钮是否禁用
	const [pageSize, setPageSize] = useState(20);	//页面显示条数
	const [curPageNum, setCurPageNum] = useState(1); //当前页码

	useEffect(() => {
		//首次进入页面加载数据
		asyncHttpGetListData({});
	}, []);

	// 表单元素
	const formItems = [
		{
			name: 'interCodeList',
			label: '债券',
			type: 'Select',
			labelSize: '38px',
			itemSize: '200px',
			props: {
				type: 'TableListByName',
				config: formServiceConfig,
				mode: 'multiple',
				maxTagCount: 1,
				maxTagTextLength: 3,
				tokenSeparators: [','],
				allowClear: true,
				placeholder: '请选择',
				showArrow: true,
			},
		},
		{
			itemSize: '250px',
			name: 'period',
			label: '评级日期段',
			labelSize: '80px',
			type: 'RangePicker',
			props: {
				allowClear: false,
				onChange(dates, dateStrings) {
					if (dateStrings && dateStrings.length) {
						changeSync({
							queryTableList: {
								...queryTableList,
								startDate: moment(dateStrings[0]).format('YYYYMMDD'),
								endDate: moment(dateStrings[1]).format('YYYYMMDD'),
							},
						});
					}
				},
			},
		},
		{
			name: 'rateCompCodeList',
			label: '评级机构',
			labelSize: '66px',
			type: 'Select',
			props: {
				type: 'ratingAgenciesListByNameOrCode',
				config: formServiceConfig,
				mode: 'multiple',
				maxTagCount: 1,
				maxTagTextLength: 9,
				placeholder: '请选择',
				showArrow: true,
			},
		},
	];

	//清空页面选中行
	const clearSelectedRows = () => {
		setSelectedRows([]);
		setIds([]);
		setDisableButton(true);
	};

	// 新增
	const addItem = (e, item) => {
		e.stopPropagation();
		changeSync({
			isOpenFormModal: {
				page: '$PageName',
				type: 'add',
				status: true,
			},
			modalOnOk: false,
		});
	};
	// 按钮组
	const ButtonType = [
		{
			name: '新增',
			iconCode: '569',
			'func-type': 'ADD',
			roule: true,
			func: addItem,
		},
		{
			name: '删除',
			'func-type': 'DELETE',
			iconCode: '470',
			roule: true,
			disabled: disableButton,
			func: () => {
				ConfirmModal({
					onOk: () => {
						// eslint-disable-next-line
						let params = selectedRows.map((item) => {
							if (item && item.id) {
								return item.id;
							}
						});
						async function fetchData() {
							await asyncHttpDeleteRowData({ params });
							await asyncHttpGetListData({});
							clearSelectedRows();
						}
						fetchData();
					},
				});
			},
		},
		{
			name: '审核',
			iconCode: '584',
			roule: true,
			'func-type': 'CHECK',
			disabled: disableButton,
			func: () => {
				ConfirmModal({
					title: '请确定是否要审核勾选数据',
					onOk: () => {
						// eslint-disable-next-line
						let params = selectedRows.map((item) => {
							if (item && item.id) {
								return item.id;
							}
						});
						async function fetchData() {
							await asyncHttpAuditRowData({ params });
							await asyncHttpGetListData({});
							clearSelectedRows();
						}
						fetchData();
					},
				});
			},
		},
		{
			name: '反审核',
			iconCode: '477',
			roule: true,
			'func-type': 'UNCHECK',
			disabled: disableButton,
			func: () => {
				ConfirmModal({
					title: '请确定是否要反审核勾选数据',
					onOk: () => {
						// eslint-disable-next-line
						let params = selectedRows.map((item) => {
							if (item && item.id) {
								return item.id;
							}
						});
						async function fetchData() {
							await asyncHttpReAuditRowData({ params });
							await asyncHttpGetListData({});
							clearSelectedRows();
						}
						fetchData();
					},
				});
			},
		},
	];

	/**查看一行**/
	const checkItem = (e, item) => {
		e.stopPropagation();
		changeSync({
			isOpenFormModal: {
				page: '$PageName',
				type: 'detail',
				status: true,
			},
			projectRowed: item,
			modalOnOk: false,
		});
	};

	/**修改一行**/
	const updateItem = (e, item) => {
		e.stopPropagation();
		changeSync({
			isOpenFormModal: {
				page: '$PageName',
				type: 'update',
				status: true,
			},
			projectRowed: item,
			modalOnOk: false,
		});
	};

	/**删除一行**/
	const deleteItem = (e, item) => {
		e.stopPropagation();
		ConfirmModal({
			onOk: () => {
				let params = [item.id];
				async function fetchData() {
					await asyncHttpDeleteRowData({ params });
					await asyncHttpGetListData({});
				}
				fetchData();
			},
		});
	};

	// 列表操作列按钮组
	const ButtonTableType = (row) => {
		const editAndDelete = [
			{
				name: '修改',
				'func-type': 'UPDATE',
				iconCode: '474',
				roule: true,
				func: updateItem,
			},
			{
				name: '删除',
				'func-type': 'DELETE',
				iconCode: '470',
				roule: true,
				func: deleteItem,
			},
		];
		if (Number(row.auditStatus) === 1) {
			return [
				{
					name: '查看',
					iconCode: '483',
					'func-type': 'QUERY',
					roule: true,
					func: checkItem,
				},
				...editAndDelete,
			];
		} else {
			return [
				{
					name: '查看',
					iconCode: '483',
					'func-type': 'QUERY',
					roule: true,
					func: checkItem,
				},
			];
		}
	};

	const getTableConfig = () => {
		// 表格列配置
		const columns = [
			...setColumns(columnsCfg),
			{
				title: '操作',
				key: 'operation',
				fixed: 'right',
				align: 'left',
				width: 150,
				render: (text, row) => withRoleTableBotton(ButtonTableType(row))(row),
			},
		];

		// 页面跳转调用函数
		const searchPage = (page, pageSize) => {
			changeSync({
				queryTableList: {
					...queryTableList,
					reqPageNum: page,
					reqPageSize: pageSize,
				},
			});
			setPageSize(pageSize);
			setCurPageNum(page);
			asyncHttpGetListData({});
			clearSelectedRows();
		};

		/***点击索引获取当前行的对象** */
		const rowSelection = {
			selectedRowKeys: ids,
			...rowSelectionFunc((records, ids) => {
				let disableButton;
				if (ids.length > 0) {
					disableButton = false;
				} else {
					disableButton = true;
				}
				setIds(ids);
				setDisableButton(disableButton);
				setSelectedRows(records);
			}),
			columnWidth: '60px',
		};

		// 表单分页配置信息
		const pagination = {
			//showQuickJumper: true,
			onChange: (page, pageSize) => {
				searchPage(page, pageSize);
			},
			onShowSizeChange: (current, size) => {
				searchPage(1, size);
			},
			showTotal: (total, range) => {
				return <span>{`共${total}条`}</span>;
			},
			total: TableListTotal,
			current: curPageNum,
			pageSize: pageSize,
			showSizeChanger: true,
			pageSizeOptions: ['10', '20', '30', '40'],
		};

		return {
			...setTableInfo({
				tableType: 'modal',
				columns,
				rowDraggable: false,
				rowSelection,
				pagination,
				bordered: false,
				height: 'calc(100vh - 191px)',
				dataSource: TableList,
			}),
		};
	};

	//弹框标题
	let modalTitle;
	if (isOpenFormModal.type === 'add') {
		modalTitle = `新增数据`;
	} else if (isOpenFormModal.type === 'update') {
		modalTitle = `修改数据`;
	} else if (isOpenFormModal.type === 'delete') {
		modalTitle = `删除数据`;
	} else {
		modalTitle = `数据详情`;
	}

	//弹框内容
	const modalContext = (type, props) => {
		return <DetailModal {...props} />;
	};

	return (
		<Fragment>
			{/* 查询表单 */}
			<div style={{ padding: '0px 20px' }}>
				<SearchForm
					formItem={formItems}
					labelSize={'70px'}
					lineOf='3'
					handleSearch={(values) => {
						delete values.period;
						changeSync({
							queryTableList: {
								...queryTableList,
								...values,
							},
						});
						let search = async () => {
							await asyncHttpGetListData({});
							setCurPageNum(1);
							clearSelectedRows();
						};
						search();
					}}
					handleBeforeReset={() => {
						let tempObj = {
							interCodeList: null,
							startDate: null,
							endDate: null,
							rateCompCodeList: null,
							reqPageNum: 1,
						};
						changeSync({
							queryTableList: {
								...queryTableList,
								...tempObj,
							},
						});
						let search = async () => {
							// 按初始化条件查询表格数据
							await asyncHttpGetListData({});
							// 设定当前页码为1
							setCurPageNum(1);
							clearSelectedRows();
						};
						search();
					}}
				/>
				{withRoleBotton(ButtonType)}
				<ConfigableTable
					{...getTableConfig()}
					tableCode='pingan-MainTable-$PageName'
				/>
			</div>
			{/***弹框组件** */}
			<Modal
				//className='dragSize'
				destroyOnClose={true}
				width={663}
				title={modalTitle}
				visible={isOpenFormModal.status}
				viewing={isOpenFormModal.type === 'detail' ? true : false}
				onOk={(e) => { changeSync({ modalOnOk: true }); }}
				onCancel={() => {
					changeSync({
						isOpenFormModal: {
							page: '$PageName',
							type: 'add',
							status: false,
						},
					});
					// 清除选中项的数据
					changeSync({
						projectRowed: {},
						modalOnOk: false,
					});
				}}
			>
				{modalContext(isOpenFormModal.type, props)}
			</Modal>
		</Fragment>
	);
}

export default MainTable;
