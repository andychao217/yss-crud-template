import React, { PureComponent, Fragment } from "react";
import { TableColumns as columnsCfg } from "../../models/columnConfig";
import {
	ConfigableTable,
	setColumns,
	setTableInfo,
	withRoleBotton,
	rowSelectionFunc,
	Modal,
	ConfirmModal,
	withRoleTableBotton,
	setClickTrStyle,
	SearchForm,
} from "yss-trade-base";
import DetailModal from "../modals/DetailModal";
import ImportModal from "../../../public-tools/ImportModal";
import { 
	importTable, 
	downloadTableTemplate,
	formServiceConfig
} from "../../services";
import '../../../public-tools/style.css';
import { paginationItemRender } from "../../../public-tools";

class MainTable extends PureComponent {
	state = {
		ids: [], //选择行id
		selectedRows: [], //选择行内容
		disableButton: true, //页面Toolbar按钮是否禁用
		pageSize: 20, //页面显示条数
		curPageNum: 1, //当前页码
		activeId: "", //当前行id
	};

	render() {
		const {
			asyncHttpGetTableList,
			asyncHttpDeleteTable,
			asyncHttpAuditTable,
			asyncHttpReauditTable,
			changeSync,
			queryTableList,
			TableList,
			TableListTotal,
			isOpenFormModal,
		} = this.props;
		const _this = this;

		// 页面Searchbar表单元素
		const formItems = [
			{
				name: "publisherCodeOrName",
				label: "发行人名称",
				type: "Input",
				itemSize: "200px",
				props: {
					placeholder: "请输入发行人名称",
				},
			},
		];

		// 页面Toolbar按钮功能
		// 新增
		const addItem = (e, item) => {
			e.stopPropagation();
			changeSync({
				isOpenFormModal: {
					page: "Table",
					type: "add",
					status: true,
				},
			});
		};

		// 导入
		const importItem = (e, item) => {
			e.stopPropagation();
			changeSync({
				isOpenFormModal: {
					page: "Table",
					type: "import",
					status: true,
				},
			});
		};

		// 页面Toolbar按钮组
		const ButtonType = [
			{
				name: "新增",
				icon: "plus",
				roule: true,
				func: addItem,
				// children: [
				// 	{
				// 		name: 'test',
				// 		func: addItem,
				// 	},
				// ],
			},
			{
				name: "删除",
				icon: "delete",
				roule: true,
				disabled: _this.state.disableButton,
				func: () => {
					ConfirmModal({
						onOk: () => {
						let params = _this.state.selectedRows.map((item) => {
							if (item && item.id) {
								return item.id;
							}
						});
						async function fetchData() {
							await asyncHttpDeleteTable({ params });
							await asyncHttpGetTableList({});
							_this.setState({
								ids: [],
								disableButton: true,
								selectedRows: [],
							});
						}
						fetchData();
						},
					});
				},
			},
			{
				name: "导入",
				icon: "upload",
				func: importItem,
			},
			{
				name: "审核",
				roule: true,
				icon: "solution",
				disabled: _this.state.disableButton,
				func: () => {
					ConfirmModal({
						title: "请确定是否要审核勾选数据",
						onOk: () => {
							let params = _this.state.selectedRows.map((item) => {
								if (item && item.id) {
								return item.id;
								}
							});
							async function fetchData() {
								await asyncHttpAuditTable({ params });
								await asyncHttpGetTableList({});
								_this.setState({
								ids: [],
								disableButton: true,
								selectedRows: [],
								});
							}
							fetchData();
						},
					});
				},
			},
			{
				name: "反审核",
				roule: true,
				icon: "file-sync",
				disabled: _this.state.disableButton,
				func: () => {
					ConfirmModal({
						title: "请确定是否要反审核勾选数据",
						onOk: () => {
							let params = _this.state.selectedRows.map((item) => {
								if (item && item.id) {
								return item.id;
								}
							});
							async function fetchData() {
								await asyncHttpReauditTable({ params });
								await asyncHttpGetTableList({});
								_this.setState({
								ids: [],
								disableButton: true,
								selectedRows: [],
								});
							}
							fetchData();
						},
					});
				},
			},
		];

		//表格操作列按钮功能
		/**修改一行**/
		const updateItem = (e, item) => {
			e.stopPropagation();
			changeSync({
				isOpenFormModal: {
					page: "Table",
					type: "update",
					status: true,
				},
				projectRowed: item,
			});
		};

		/**查看一行**/
		const checkItem = (e, item) => {
			e.stopPropagation();
			changeSync({
				isOpenFormModal: {
					page: "Table",
					type: "check",
					status: true,
				},
				projectRowed: item,
			});
		};

		/**删除一行**/
		const deleteItem = (e, item) => {
			e.stopPropagation();
			ConfirmModal({
				title: "请确定是否要删除当前数据",
				onOk: () => {
					async function fetchData() {
						await asyncHttpDeleteTable({ params: item.id });
						await asyncHttpGetTableList({});
					}
					fetchData();
				},
			});
		};

		//表格操作列按钮配置
		const ButtonTableType = (row) => {
			const editAndDelete = [
				{
					name: "修改",
					icon: "edit",
					roule: true,
					func: updateItem,
				},
				{
					name: "删除",
					icon: "delete",
					roule: true,
					func: deleteItem,
				},
			];
			if (Number(row.auditStatus) === 1) {
				return [
					{
						name: "查看",
						icon: "edit",
						roule: true,
						func: checkItem,
					},
					...editAndDelete,
				];
			} else {
				return [
					{
						name: "查看",
						icon: "edit",
						roule: true,
						func: checkItem,
					},
				];
			}
		};

		//表格配置
		const getTableConfig = () => {
			// 表格列配置
			const columns = [
				...setColumns(columnsCfg),
				{
					title: "操作",
					key: "operation",
					fixed: "right",
					align: "left",
					width: 180,
					render: (row) => {
						return withRoleTableBotton(ButtonTableType(row))(row);
					},
				},
			];

			// 页面跳转调用函数
			const searchPage = (page, pageSize) => {
				//修改页码，每页显示条数
				changeSync({
					queryTableList: {
						...queryTableList,
						reqPageNum: page,
						reqPageSize: pageSize,
					},
				});
				_this.setState({
					ids: [],
					disableButton: true,
					selectedRows: [],
					pageSize,
					curPageNum: page,
				});
				//加载数据
				asyncHttpGetTableList({});
			};

			/***点击索引获取当前行的行的对象** */
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
				columnWidth: "60px",
			};

			// 表单分页配置信息
			const pagination = {
				//showQuickJumper: true,
				//itemRender: paginationItemRender,
				//切换页面
				onChange: (page, pageSize) => {
					searchPage(page, pageSize);
				},
				//切换每页多少条
				onShowSizeChange: (current, size) => {
					searchPage(current, size);
				},
				//显示总条数
				showTotal: (total, range) => {
					return <span>{`共${total}条`}</span>;
				},
				//数据总数
				total: TableListTotal,
				//当前页码
				current: _this.state.curPageNum,
				//当前每页显示条数
				pageSize: _this.state.pageSize,
				//是否显示每页条数切换器
				showSizeChanger: true,
			};

			return {
				...setTableInfo({
					tableType: "modal",
					columns,
					rowDraggable: false,
					rowSelection,
					pagination,
					bordered: true,
					height: "calc(100vh - 270px)",
					dataSource: TableList,
					onRow: (record) => {
						return {
							onClick: (event) => {
								setClickTrStyle(event);
								_this.setState({
									activeId: record.id,
								});
							},
						};
					},
				}),
			};
		};

		const setRowClass = (record, index) => {
			const rowClassList =
				_this.state.activeId === record.id ? "row-selected" : ""; //高亮点击行
			return rowClassList;
		};

		//导入成功后调用的操作
		const callBack = (msg) => {
			//关闭弹框
			changeSync({
				isOpenFormModal: {
				page: isOpenFormModal.page,
				type: "add",
				status: false,
				},
			});
			//加载数据
			asyncHttpGetTableList({});
		};

		// modal 标题设置
		let modalTitle;
		if (isOpenFormModal.type === "add") {
			modalTitle = `新增`;
		} else if (isOpenFormModal.type === "update") {
			modalTitle = `修改`;
		} else if (isOpenFormModal.type === "check") {
			modalTitle = `查看`;
		} else if (isOpenFormModal.type === "delete") {
			modalTitle = `删除`;
		} else {
			modalTitle = `导入文件`;
		}

		// 导入modal说明文字
		const importNotesTable = `说明：
		当前支持导入的文件格式为：excel格式（*.xls,*.xlsx）
	格式说明：
		列头：|发行人名称|短期|长期|永续|
		内容：|北京**有限公司|可投|禁投|禁投|`;

		// 判断使用哪种modal组件
		const modalContext = (type, props) => {
			if (type === "import") {
				const options = {
					uploadAPI: importTable,
					note: importNotesTable,
					downloadURL: downloadTableTemplate,
					name: "发行人",
					callBackFunc: callBack,
				};
				return <ImportModal {...props} options={options} />;
			} else {
				return <DetailModal {...props} />;
			}
		};

		return (
			<Fragment>
				{/* 查询表单 */}
				<SearchForm
					formItem={formItems}
					labelSize={"5em"}
					lineOf="2"
					handleSearch={(values) => {
						// Searchbar 点击查询按钮操作
						changeSync({
							queryTableList: {
								...queryTableList,
								...values,
								reqPageNum: 1,
							},
						});
						let search = async () => {
							await asyncHttpGetTableList({});
							_this.setState({
								curPageNum: 1,
							});
						};
						search();
					}}
					handleBeforeReset={() => {
						// Searchbar 点击重置按钮操作， 清空searchbar参数
						changeSync({
							queryTableList: {
								...queryTableList,
								reqPageNum: 1,
							},
						});
						let search = async () => {
						// 按初始化条件查询表格数据
							await asyncHttpGetTableList({});
							// 设定当前页码为1
							_this.setState({
								curPageNum: 1,
							});
						};
						search();
					}}
				/>
				{/***Toolbar组件** */}
				{withRoleBotton(ButtonType)}
				{/***表格组件** */}
				<ConfigableTable
					{...getTableConfig()}
					rowClassName={setRowClass}
				>
				</ConfigableTable>
				{/***弹框组件** */}
				<Modal
					//className="dragSize"
					destroyOnClose={true}
					width={800}
					title={modalTitle}
					visible={isOpenFormModal.status}
					onCancel={() => {
						//关闭modal
						changeSync({
							isOpenFormModal: {
								page: "Table",
								type: "add",
								status: false,
							},
							projectRowed: {},
						});
					}}
				>
					{/***Modal内容** */}
					{modalContext(isOpenFormModal.type, _this.props)}
				</Modal>
			</Fragment>
		);
	}

	componentDidMount() {
		const { asyncHttpGetTableList } = this.props;

		//首次进入页面加载数据
		async function fetchData() {
			await asyncHttpGetTableList({});
		}
		fetchData();
	}
}

export default MainTable;
