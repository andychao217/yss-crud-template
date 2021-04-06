import { formatRowColor } from '../../public-tools';
import { momentToDateStr } from 'yss-trade-base';

//债券评级列表表头
const columnsCfg = [
	{
		title: '序号',
		dataIndex: 'serialNumber',
		align: 'left',
		width: 100,
	},
	{
		title: '债券代码',
		dataIndex: 'securityCode',
		align: 'left',
		width: 120,
		render: (text, record) => {
			return formatRowColor(text, record);
		},
	},
	{
		title: '债券市场',
		dataIndex: 'marketCodeName',
		align: 'left',
		width: 160,
		render: (text, record) => {
			return formatRowColor(text, record);
		},
	},
	{
		title: '评级类型',
		dataIndex: 'rateTypeName',
		align: 'left',
		width: 130,
		render: (text, record) => {
			return formatRowColor(text, record);
		},
	},
	{
		title: '评级日期',
		dataIndex: 'creditDate',
		align: 'left',
		width: 120,
		render: (text, record) => {
			return formatRowColor(momentToDateStr(text, 'YYYY-MM-DD'), record);
		},
	},
	{
		title: '信用评级',
		dataIndex: 'creditRateName',
		align: 'left',
		width: 110,
		render: (text, record) => {
			return formatRowColor(text, record);
		},
	},
	{
		title: '评级展望',
		dataIndex: 'exptRatingName',
		align: 'left',
		width: 110,
		render: (text, record) => {
			return formatRowColor(text, record);
		},
	},
	{
		title: '评级机构',
		dataIndex: 'rateCompName',
		align: 'left',
		width: 290,
		render: (text, record) => {
			return formatRowColor(text, record);
		},
	},
	{
		title: '是否外部评级',
		dataIndex: 'externalFlagName',
		align: 'left',
		width: 140,
		render: (text, record) => {
			return formatRowColor(text, record);
		},
	},
	{
		title: '审核状态',
		dataIndex: 'auditStatus',
		width: 110,
		align: 'left',
		unConvert: true,
		render: (text, record) => {
			let displayText = Number(text) === 1 ? '未审核' : '已审核';
			return formatRowColor(displayText, record);
		},
	},
	{
		title: '数据来源',
		dataIndex: 'dataSourceName',
		align: 'left',
		width: 110,
		render: (text, record) => {
			return formatRowColor(text, record);
		},
	},
];

export { columnsCfg };
