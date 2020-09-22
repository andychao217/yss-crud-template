import React, { Fragment, useContext, useState, useEffect, useRef } from 'react';
import { issuersColumns as columnsCfg } from '../../models/columnConfig';
import {
	ConfigableTable,
	setColumns,
	setTableInfo,
	withRoleBotton,
	PublicProps,
	rowSelectionFunc,
	Modal,
	ConfirmModal,
	withRoleTableBotton,
	setClickTrStyle,
	SearchForm,
} from 'yss-trade-base';
import IssuerDetailModal from '../modals/IssuerDetailModal';
import ImportModal from '../../../public-tools/ImportModal';
import { importIssuers, downloadIssuersTemplate } from '../../services';

const IssuersTable = (props) => {
	const {
		asyncHttpGetIssuersList,
		asyncHttpDeleteIssuers,
		asyncHttpAuditIssuers,
		asyncHttpReauditIssuers,
		changeSync,
		queryIssuersList,
		issuersList,
		issuersListTotal,
		isOpenFormModal,
	} = useContext(PublicProps);

	//首次进入页面加载数据
	useEffect(() => {
		async function fetchData() {
			await asyncHttpGetIssuersList({});
		}
		fetchData();
		console.log('代码更新日期2020-08-18 13:20-Andy');
	}, []);

	//页面变量
	//选择行id
	const [ids, setIds] = useState([]);
	const [selectedRows, setSelectedRows] = useState([]);
	//页面Toolbar按钮是否禁用
	const [disableButton, setDisableButton] = useState(true);
	const currentRef = useRef();
	//页面显示条数
	const [pageSize, setPageSize] = useState(20);
	//当前页码
	const [curPageNum, setCurPageNum] = useState(1);

	// 页面Searchbar表单元素
	const formItems = [
		{
			name: 'publisherCodeOrName',
			label: '发行人名称',
			type: 'Input',
			itemSize: '200px',
			props: {
				placeholder: '请输入发行人名称',
			},
		},
	];

	// 页面Toolbar按钮功能
	// 新增
	const addItem = (e, item) => {
		e.stopPropagation();
		changeSync({
			isOpenFormModal: {
				page: 'issuers',
				type: 'add',
				status: true,
			},
		});
	};

	// 导入
	const importItem = (e, item) => {
		e.stopPropagation();
		changeSync({
			isOpenFormModal: {
				page: 'issuers',
				type: 'import',
				status: true,
			},
		});
	};

	// 页面Toolbar按钮组
	const ButtonType = [
		{
			name: '新增',
			icon: 'plus',
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
			name: '删除',
			icon: 'delete',
			roule: true,
			disabled: disableButton,
			func: () => {
				ConfirmModal({
					onOk: () => {
						let params = selectedRows.map((item) => {
							if (item && item.id) {
								return item.id;
							}
						});
						async function fetchData() {
							await asyncHttpDeleteIssuers({ params });
							await asyncHttpGetIssuersList({});
							setIds([]);
							setSelectedRows([]);
							setDisableButton(true);
						}
						fetchData();
					},
				});
			},
		},
		{
			name: '导入',
			icon: 'upload',
			func: importItem,
		},
		{
			name: '审核',
			roule: true,
			icon: 'solution',
			disabled: disableButton,
			func: () => {
				ConfirmModal({
					title: '请确定是否要审核勾选数据',
					onOk: () => {
						let params = selectedRows.map((item) => {
							if (item && item.id) {
								return item.id;
							}
						});
						async function fetchData() {
							await asyncHttpAuditIssuers({ params });
							await asyncHttpGetIssuersList({});
							setIds([]);
							setSelectedRows([]);
							setDisableButton(true);
						}
						fetchData();
					},
				});
			},
		},
		{
			name: '反审核',
			roule: true,
			icon: 'file-sync',
			disabled: disableButton,
			func: () => {
				ConfirmModal({
					title: '请确定是否要反审核勾选数据',
					onOk: () => {
						let params = selectedRows.map((item) => {
							if (item && item.id) {
								return item.id;
							}
						});
						async function fetchData() {
							await asyncHttpReauditIssuers({ params });
							await asyncHttpGetIssuersList({});
							setIds([]);
							setSelectedRows([]);
							setDisableButton(true);
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
				page: 'issuers',
				type: 'update',
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
				page: 'issuers',
				type: 'check',
				status: true,
			},
			projectRowed: item,
		});
	};

	/**删除一行**/
	const deleteItem = (e, item) => {
		e.stopPropagation();
		ConfirmModal({
			title: '请确定是否要删除当前数据',
			onOk: () => {
				async function fetchData() {
					await asyncHttpDeleteIssuers({ params: item.id });
					await asyncHttpGetIssuersList({});
				}
				fetchData();
			},
		});
	};

	//表格操作列按钮配置
	const ButtonTableType = (row) => {
		const editAndDelete = [
			{
				name: '修改',
				icon: 'edit',
				roule: true,
				func: updateItem,
			},
			{
				name: '删除',
				icon: 'delete',
				roule: true,
				func: deleteItem,
			},
		];
		if (Number(row.auditStatus) === 1) {
			return [
				{
					name: '查看',
					icon: 'edit',
					roule: true,
					func: checkItem,
				},
				...editAndDelete,
			];
		} else {
			return [
				{
					name: '查看',
					icon: 'edit',
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
				title: '操作',
				key: 'operation',
				fixed: 'right',
				align: 'left',
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
				queryIssuersList: {
					...queryIssuersList,
					reqPageNum: page,
					reqPageSize: pageSize,
				},
			});
			//设定每页显示条数
			setPageSize(pageSize);
			//设定当前页码
			setCurPageNum(page);
			setIds([]);
			setSelectedRows([]);
			setDisableButton(true);
			//加载数据
			asyncHttpGetIssuersList({});
		};

		/***点击索引获取当前行的行的对象** */

		const rowSelection = {
			selectedRowKeys: ids,
			...rowSelectionFunc((records, ids) => {
				setIds(ids);
				setSelectedRows(records);
				if (ids.length > 0) {
					setDisableButton(false);
				} else {
					setDisableButton(true);
				}
			}),
			columnWidth: '60px',
		};

		// 表单分页配置信息
		const pagination = {
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
			total: issuersListTotal,
			//当前页码
			current: curPageNum,
			//当前每页显示条数
			pageSize,
			//是否显示每页条数切换器
			showSizeChanger: true,
		};

		return {
			...setTableInfo({
				tableType: 'modal',
				columns,
				rowDraggable: false,
				rowSelection,
				pagination,
				bordered: true,
				height: 'calc(100vh - 270px)',
				dataSource: issuersList,
				onRow: (record) => {
					return {
						onClick: (event) => {
							setClickTrStyle(event);
						},
					};
				},
			}),
		};
	};

	//导入成功后调用的操作
	const callBack = (msg) => {
		//关闭弹框
		changeSync({
			isOpenFormModal: {
				page: isOpenFormModal.page,
				type: 'add',
				status: false,
			},
		});
		//加载数据
		asyncHttpGetIssuersList({});
	};

	// modal 标题设置
	let modalTitle;
	if (isOpenFormModal.type === 'add') {
		modalTitle = `新增发行人`;
	} else if (isOpenFormModal.type === 'update') {
		modalTitle = `修改发行人`;
	} else if (isOpenFormModal.type === 'check') {
		modalTitle = `查看发行人`;
	} else if (isOpenFormModal.type === 'delete') {
		modalTitle = `删除发行人`;
	} else {
		modalTitle = `导入文件`;
	}

	// 导入modal说明文字
	const importNotesIssuers = `说明：
	当前支持导入的文件格式为：excel格式（*.xls,*.xlsx）
格式说明：
	列头：|发行人名称|短期|长期|永续|
	内容：|北京**有限公司|可投|禁投|禁投|`;

	// 判断使用哪种modal组件
	const modalContext = (type, props) => {
		if (type === 'import') {
			let options;
			options = {
				uploadAPI: importIssuers,
				note: importNotesIssuers,
				downloadURL: downloadIssuersTemplate,
				name: '发行人',
				callBackFunc: callBack,
			};
			return <ImportModal {...props} options={options} />;
		} else {
			return <IssuerDetailModal {...props} />;
		}
	};

	return (
		<Fragment>
			{/* 查询表单 */}
			<SearchForm
				ref={currentRef}
				formItem={formItems}
				labelSize={'5em'}
				lineOf="2"
				handleSearch={(values) => {
					// Searchbar 点击查询按钮操作
					changeSync({
						queryIssuersList: {
							...queryIssuersList,
							...values,
						},
					});
					let search = async () => {
						await asyncHttpGetIssuersList({});
						setCurPageNum(1);
					};
					search();
				}}
				handleBeforeReset={() => {
					// Searchbar 点击重置按钮操作， 清空searchbar参数
					let publisherCodeOrName = '';
					changeSync({
						queryIssuersList: {
							...queryIssuersList,
							publisherCodeOrName,
						},
					});
					let search = async () => {
						// 按初始化条件查询表格数据
						await asyncHttpGetIssuersList({});
						// 设定当前页码为1
						setCurPageNum(1);
					};
					search();
				}}
			/>
			{/***Toolbar组件** */}
			{withRoleBotton(ButtonType)}
			{/***表格组件** */}
			<ConfigableTable {...getTableConfig()}></ConfigableTable>
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
							page: 'issuers',
							type: 'add',
							status: false,
						},
					});
					// 清除选中项的数据
					changeSync({
						projectRowed: {},
					});
				}}
			>
				{/***Modal内容** */}
				{modalContext(isOpenFormModal.type, useContext(PublicProps))}
			</Modal>
		</Fragment>
	);
};

export default IssuersTable;
