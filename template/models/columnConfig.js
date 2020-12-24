import { formatRowColor } from '../../public-tools';

//列表 自定义
const TableColumns = [
	{
		title: '序号',
		dataIndex: 'serialNumber',
		align: 'center',
		fixed: 'left',
		width: 100,
	},
	{
		title: '代码',
		dataIndex: 'publisherCode',
		align: 'left',
		//width: 100,
		render: (text, record) => {
			return formatRowColor(text, record);
		},
	},
	{
		title: '名称',
		dataIndex: 'publisherName',
		align: 'left',
		//width: 200,
		render: (text, record) => {
			return formatRowColor(text, record);
		},
	},
	{
		title: '审核',
		dataIndex: 'auditStatus',
		align: 'left',
		width: 150,
		unConvert: true,
		render: (text, record) => {
			let displayText = Number(record.auditStatus) === 1 ? '未审核' : '已审核';
			return formatRowColor(displayText, record);
		},
	},
];

export { TableColumns };
