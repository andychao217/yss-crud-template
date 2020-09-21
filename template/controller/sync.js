import { publicSync } from 'yss-trade-base';
/*
  setModalStatus  //设置弹窗状态
  setTrDatas //设置点击或选中行数据
  setPages //设置分页
  setModelData //设置其它模型数据
*/

export default {
	...publicSync,
	changeSync(state, params, { getState }) {
		state = getState();
		return state.merge({ ...params });
	},
};
