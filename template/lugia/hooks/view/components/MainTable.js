/**
 * @file 数据表格组件
 * @author $AuthorName
 * @copyright Ysstech
 */
import React, { useState, useEffect, Fragment, useRef } from 'react';
import moment from 'moment';
import { columnsCfg } from '../../models/columnConfig';
import { ReactTable, columnSortSet, tableSet, withRoleBotton, Modal, ConfirmModal, withRoleTableBotton, SearchForm } from 'yss-trade-base';
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
	const searchForm = useRef();
	const _this = this;
	const [ids, setIds] = useState([]); //选择行id
	const [selectedRows, setSelectedRows] = useState([]); //选择行内容
	// const [pageSize, setPageSize] = useState(20); //页面显示条数
	// const [curPageNum, setCurPageNum] = useState(1); //当前页码

	useEffect(() => {
		//首次进入页面加载数据
		asyncHttpGetListData({ params: { resetPage: true } });
	}, []);

	// 表单元素
	const formItems = [
		{
			name: 'interCodeList',
			label: '债券',
			type: 'Select',
			labelSize: '38px',
			itemSize: '160px',
			props: {
				type: 'TableListByName',
				config: formServiceConfig,
				mode: 'multiple',
				maxTagCount: 1,
				maxTagTextLength: 1,
				tokenSeparators: [','],
				allowClear: true,
				placeholder: '请选择',
				showArrow: true,
				dropDownStyle: {
					maxHeight: '400px',
				},
				dropdownMatchSelectWidth: false,
				getPopupContainer: () => document.getElementById('$PageNameMainTable'),
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
				getCalendarContainer: () => document.getElementById('$PageNameMainTable'),
			},
		},
		{
			name: 'rateCompCodeList',
			label: '评级机构',
			labelSize: '66px',
			itemSize: '160px',
			type: 'Select',
			props: {
				type: 'ratingAgenciesListByNameOrCode',
				config: formServiceConfig,
				mode: 'multiple',
				maxTagCount: 1,
				maxTagTextLength: 1,
				placeholder: '请选择',
				showArrow: true,
				dropDownStyle: {
					maxHeight: '400px',
				},
				dropdownMatchSelectWidth: false,
				getPopupContainer: () => document.getElementById('$PageNameMainTable'),
			},
		},
	];

	//清空页面选中行
	const clearSelectedRows = () => {
		setSelectedRows([]);
		setIds([]);
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
			disabled: !selectedRows.length || !TableList.length,
			func: () => {
				ConfirmModal({
					onOk: () => {
						let params = selectedRows.filter((item) => item && item.id).map((item) => item.id);
						async function fetchData() {
							await asyncHttpDeleteRowData({ params });
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
			disabled: !selectedRows.length || !TableList.length,
			func: () => {
				ConfirmModal({
					title: '请确定是否要审核勾选数据',
					onOk: () => {
						let params = selectedRows.filter((item) => item && item.id).map((item) => item.id);
						async function fetchData() {
							await asyncHttpAuditRowData({ params });
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
			disabled: !selectedRows.length || !TableList.length,
			func: () => {
				ConfirmModal({
					title: '请确定是否要反审核勾选数据',
					onOk: () => {
						let params = selectedRows.filter((item) => item && item.id).map((item) => item.id);
						async function fetchData() {
							await asyncHttpReAuditRowData({ params });
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
		const columns = columnSortSet([
			...columnsCfg,
			{
				title: '操作',
				key: 'operation',
				dataIndex: 'operation',
				fixed: 'right',
				align: 'left',
				width: 120,
				lock: true,
				render: (text, row) => withRoleTableBotton(ButtonTableType(row), 'icon')(row),
			},
		]);

		// 页面跳转调用函数
		const searchPage = (page, pageSize) => {
			changeSync({
				queryTableList: {
					...queryTableList,
					reqPageNum: page,
					reqPageSize: pageSize,
				},
			});
			// setPageSize(pageSize);
			// setCurPageNum(page);
			asyncHttpGetListData({ params: { resetPage: false } });
			clearSelectedRows();
		};

		/***点击索引获取当前行的对象** */
		const rowSelection = {
			selectedRowKeys: ids,
			onChange: (ids, records) => {
				setIds(ids);
				setSelectedRows(records);
			},
			columnWidth: '60px',
			fixed: true,
		};

		// 表单分页配置信息
		// const pagination = {
		// 	//showQuickJumper: true,
		// 	onChange: (page, pageSize) => {
		// 		searchPage(page, pageSize);
		// 	},
		// 	onShowSizeChange: (current, size) => {
		// 		searchPage(1, size);
		// 	},
		// 	showTotal: (total, range) => {
		// 		return <span>{`共${total}条`}</span>;
		// 	},
		// 	total: TableListTotal,
		// 	current: curPageNum,
		// 	pageSize: pageSize,
		// 	showSizeChanger: true,
		// 	pageSizeOptions: ['10', '20', '30', '40'],
		// };

		/***表格分页***/
		const scorllPagination = {
			total: TableListTotal,
			pageSize: queryTableList.reqPageSize,
			current: queryTableList.reqPageNum,
			onNextPage: (page, pageSize) => {
				searchPage(page, pageSize);
			},
		};

		return {
			...tableSet({
				tableType: 'modal',
				columns,
				rowDraggable: false,
				rowSelection,
				scorllPagination,
				pagination: false,
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
		return <DetailModal ref={modalRef} {...props} clearSelectedRows={clearSelectedRows} />;
	};

	return (
		<Fragment>
			{/* 查询表单 */}
			<div id='$PageNameMainTable' style={{ padding: '0px 20px', position: 'relative' }}>
				<SearchForm
					refs={(ref) => {
						searchForm.current = ref;
					}}
					formItem={formItems}
					labelSize={'70px'}
					lineOf='3'
					handleSearch={(values) => {
						const businessStartDate = values.period && values.period.length ? moment(values.period[0]).format('YYYY-MM-DD') : null;
						const businessEndDate = values.period && values.period.length ? moment(values.period[1]).format('YYYY-MM-DD') : null;
						delete values.period;
						changeSync({
							queryTableList: {
								...queryTableList,
								...values,
								businessStartDate,
								businessEndDate,
								reqPageNum: 1,
							},
						});
						let search = async () => {
							await asyncHttpGetListData({ params: { resetPage: true } });
							// setCurPageNum(1);
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
							await asyncHttpGetListData({ params: { resetPage: true } });
							// 设定当前页码为1
							// setCurPageNum(1);
							clearSelectedRows();
						};
						search();
					}}
				/>
				{withRoleBotton(ButtonType)}
				<ReactTable {...getTableConfig()} resizeTableCode='MainTable-$PageName' tableCode='pingan-MainTable-$PageName' />
			</div>
			{/***弹框组件** */}
			<Modal
				//className='dragSize'
				destroyOnClose={true}
				width={663}
				title={modalTitle}
				visible={isOpenFormModal.status}
				viewing={isOpenFormModal.type === 'detail' ? true : false}
				onOk={() => {
					modalRef.current.handleSubmit();
				}}
				onCancel={() => {
					changeSync({
						isOpenFormModal: {
							page: '$PageName',
							type: 'add',
							status: false,
						},
						projectRowed: {},
					});
				}}
			>
				{modalContext(isOpenFormModal.type, props)}
			</Modal>
		</Fragment>
	);
};

export default MainTable;
