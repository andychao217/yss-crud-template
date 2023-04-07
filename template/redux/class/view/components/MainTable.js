/**
 * @file 数据表格组件
 * @author $AuthorName
 * @copyright Ysstech
 */
import React, { PureComponent, Fragment } from 'react';
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
import { UpdateStore } from '../../models/actions';
import { columnsCfg } from '../../models';
import OperationRecordTable from '@/front-biz/common/components/OperationRecordTable';
import { httpGetListData, httpAuditRowData, httpReAuditRowData, httpDeleteRowData } from '../../controller/async';

/**
 * @class
 * @classdesc 数据表格
 */
let $mainTable = null;
class MainTable extends PureComponent {
	state = {
		ids: [], //选择行id
		selectedRows: [], //选择行内容
		disableButton: true, //页面Toolbar按钮是否禁用
		// pageSize: 20, //页面显示条数
		// curPageNum: 1, //当前页码
	};

	componentDidMount() {
		//首次进入页面加载数据
		httpGetListData(true);
	}

	render() {
		const { dispatchUpdateStore, queryTableList, TableList, TableListTotal, isOpenFormModal, projectRowed } = this.props;

		const _this = this;

		// 表单元素
		const formItems = [
			{
				name: 'interCodeList',
				label: '债券',
				type: 'Select',
				labelSize: '38px',
				itemSize: '160px',
				props: {
					type: 'BondListByName',
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
			_this.setState({
				ids: [],
				disableButton: true,
				selectedRows: [],
			});
			$mainTable.setState({
				serialNumber: null,
			});
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
				disabled: _this.state.disableButton,
				func: () => {
					ConfirmModal({
						onOk: () => {
							let params = _this.state.selectedRows.filter((item) => item && item.id).map((item) => item.id);
							httpDeleteRowData(params);
							clearSelectedRows();
						},
					});
				},
			},
			{
				name: '审核',
				iconCode: '584',
				roule: true,
				'func-type': 'CHECK',
				disabled: _this.state.disableButton,
				func: () => {
					ConfirmModal({
						title: '请确定是否要审核勾选数据',
						onOk: () => {
							let params = _this.state.selectedRows.filter((item) => item && item.id).map((item) => item.id);
							httpAuditRowData(params);
							clearSelectedRows();
						},
					});
				},
			},
			{
				name: '反审核',
				iconCode: '477',
				roule: true,
				'func-type': 'UNCHECK',
				disabled: _this.state.disableButton,
				func: () => {
					ConfirmModal({
						title: '请确定是否要反审核勾选数据',
						onOk: () => {
							let params = _this.state.selectedRows.filter((item) => item && item.id).map((item) => item.id);
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
			return [
				{
					name: '查看',
					iconCode: '483',
					'func-type': 'QUERY',
					roule: true,
					func: checkItem,
				},
				{
					name: '修改',
					'func-type': 'UPDATE',
					iconCode: '474',
					roule: true,
					func: updateItem,
					disabled: Number(row.auditStatus) === 2,
				},
				{
					name: '删除',
					'func-type': 'DELETE',
					iconCode: '470',
					roule: true,
					func: deleteItem,
					disabled: Number(row.auditStatus) === 2,
				},
				{
					name: '操作记录',
					'func-type': 'QUERY',
					iconCode: '473',
					func: (e, item) => {
						e.stopPropagation();
						dispatchUpdateStore({
							isOpenFormModal: {
								page: '$PageName',
								type: 'log',
								status: true,
							},
							projectRowed: item,
						});
					},
				},
			];
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
					width: 120,
					render: (text, row) => withRoleTableBotton(ButtonTableType(row), 'icon')(row),
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
				});
				// _this.setState({
				// 	pageSize,
				// 	curPageNum: page,
				// });
				httpGetListData(false);
				clearSelectedRows();
			};

			/***点击索引获取当前行的对象** */
			const rowSelection = {
				selectedRowKeys: _this.state.ids,
				...rowSelectionFunc((records, ids) => {
					let disableButton;
					if (ids.length > 0) {
						disableButton = false;
					} else {
						disableButton = true;
					}
					_this.setState({
						ids,
						disableButton,
						selectedRows: records,
					});
				}),
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
			// 	current: _this.state.curPageNum,
			// 	pageSize: _this.state.pageSize,
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
				...setTableInfo({
					tableType: 'modal',
					columns,
					rowDraggable: false,
					rowSelection,
					scorllPagination,
					pagination: false,
					bordered: false,
					height: 'calc(100vh - 161px)',
					dataSource: TableList,
					onRow: (record) => {
						return {
							onClick: () => {
								$mainTable.setState({
									serialNumber: record.id,
								});
								if (record.id !== projectRowed.id) {
									dispatchUpdateStore({
										projectRowed: record,
									});
								}
							},
						};
					},
				}),
			};
		};

		// 弹框标题
		let modalTitle;
		if (isOpenFormModal.type === 'add') {
			modalTitle = `新增`;
		} else if (isOpenFormModal.type === 'update') {
			modalTitle = `修改`;
		} else if (isOpenFormModal.type === 'log') {
			modalTitle = `操作记录`;
		} else {
			modalTitle = `查看`;
		}

		// 弹框内容
		const modalContext = (type, props) => {
			if (type === 'log') {
				return <OperationRecordTable params={{ businIds: [projectRowed.id], tableName: 'offipo_association_register' }} />;
			} else {
				return <DetailModal {...props} />;
			}
		};

		return (
			<Fragment>
				{/* 查询表单 */}
				<div id='$PageNameMainTable' style={{ padding: '0px 20px', position: 'relative' }}>
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
									reqPageNum: 1,
								},
							});
							const search = () => {
								httpGetListData(true);
								// _this.setState({
								// 	curPageNum: 1,
								// });
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
								httpGetListData(true);
								// 设定当前页码为1
								// _this.setState({
								// 	curPageNum: 1,
								// });
								clearSelectedRows();
							};
							search();
						}}
					/>
					{withRoleBotton(ButtonType)}
					<ConfigableTable
						ref={(ref) => ($mainTable = ref)}
						{...getTableConfig()}
						resizeTableCode='MainTable-$PageName'
						tableCode='pingan-MainTable-$PageName'
						className='pingan-MainTable-$PageName'
					/>
				</div>
				{/***弹框组件** */}
				<Modal
					destroyOnClose={true}
					width={663}
					title={modalTitle}
					visible={isOpenFormModal.status}
					viewing={isOpenFormModal.type === 'detail' || isOpenFormModal.type === 'log' ? true : false}
					onCancel={() => {
						dispatchUpdateStore({
							isOpenFormModal: {
								page: '$PageName',
								type: 'add',
								status: false,
							},
							projectRowed: {},
						});
					}}
				>
					{modalContext(isOpenFormModal.type, _this.props)}
				</Modal>
			</Fragment>
		);
	}
}

export default MainTable;
