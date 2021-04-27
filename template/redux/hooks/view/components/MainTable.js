/**
 * @file 数据表格组件
 * @author $AuthorName
 * @copyright Ysstech
 */
import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
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
import {
	UpdateStore,
} from '../../models/actions';
import {
	columnsCfg,
} from '../../models';
import {
	httpGetListData,
	httpAuditRowData,
	httpReAuditRowData,
	httpDeleteRowData,
} from '../../controller/async';

/**
 * @class
 * @classdesc 数据表格
 */
const MainTable = (props) => {
	const {
		dispatchUpdateStore,
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
		httpGetListData();
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
				type: 'BondListByName',
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
						dispatchUpdateStore({
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
		dispatchUpdateStore({
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
			icon: 'plus',
			'func-type': 'ADD',
			roule: true,
			func: addItem,
		},
		{
			name: '删除',
			'func-type': 'DELETE',
			icon: 'delete',
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
						httpDeleteRowData(params);
						clearSelectedRows();
					},
				});
			},
		},
		{
			name: '审核',
			icon: 'solution',
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
						httpAuditRowData(params);
						clearSelectedRows();
					},
				});
			},
		},
		{
			name: '反审核',
			icon: 'file-sync',
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
						httpReAuditRowData(params);
						clearSelectedRows();
					},
				});
			},
		},
	];

	/**查看一行**/
	const checkItem = (e, item) => {
		e.stopPropagation();
		dispatchUpdateStore({
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
		dispatchUpdateStore({
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
				httpDeleteRowData(params);
			},
		});
	};

	// 列表操作列按钮组
	const ButtonTableType = (row) => {
		const editAndDelete = [
			{
				name: '修改',
				'func-type': 'UPDATE',
				icon: 'edit',
				roule: true,
				func: updateItem,
			},
			{
				name: '删除',
				'func-type': 'DELETE',
				icon: 'delete',
				roule: true,
				func: deleteItem,
			},
		];
		if (Number(row.auditStatus) === 1) {
			return [
				{
					name: '查看',
					icon: 'search',
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
					icon: 'search',
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
				width: 230,
				render: (text, row) => withRoleTableBotton(ButtonTableType(row))(row),
			},
		];

		// 页面跳转调用函数
		const searchPage = (page, pageSize) => {
			dispatchUpdateStore({
				queryTableList: {
					...queryTableList,
					reqPageNum: page,
					reqPageSize: pageSize,
				},
			})
			setIds([]);
			setDisableButton(true);
			setSelectedRows([]);
			setPageSize(pageSize);
			setCurPageNum(page);
			httpGetListData();
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
			//itemRender: paginationItemRender,
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
				height: process.env.NODE_ENV === 'production'? 'calc(100vh - 180px)' : 'calc(100vh - 280px)', //本地开发用280
				dataSource: TableList,
			}),
		};
	};

	// 弹框标题
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

	// 弹框内容
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
						dispatchUpdateStore({
							queryTableList: {
								...queryTableList,
								...values,
							},
						});
						const search = () => {
							httpGetListData();
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
						dispatchUpdateStore({
							queryTableList: {
								...queryTableList,
								...tempObj,
							},
						});
						const search = () => {
							// 按初始化条件查询表格数据
							httpGetListData();
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
				destroyOnClose={true}
				width={663}
				title={modalTitle}
				visible={isOpenFormModal.status}
				viewing={isOpenFormModal.type === 'detail' ? true : false}
				onCancel={() => {
					dispatchUpdateStore({
						isOpenFormModal: {
							page: '$PageName',
							type: 'add',
							status: false,
						},
						projectRowed: {},
						modalOnOk: false,
					});
				}}
				onOk={(e) => { dispatchUpdateStore({ modalOnOk: true }); }}
			>
				{modalContext(isOpenFormModal.type, props)}
			</Modal>
		</Fragment>
	);
}

//redux state转换为props
const mapStateToProps = (state) => {
	return state.pageReducer;
};

const mapDispatchToProps = {
	dispatchUpdateStore: (params) => UpdateStore(params),
}
// const mapDispatchToProps = (dispatch) => {
// 	return {
// 		dispatchUpdateStore: (params) => dispatch(UpdateStore(params)),
// 	};
// };

export default connect(mapStateToProps, mapDispatchToProps)(MainTable);
