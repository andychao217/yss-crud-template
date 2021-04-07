/**
 * @file 同步修改state方法
 * @author Andy Chao <zhaoqing@ysstech.com>
 * @copyright Ysstech
 */
import { publicSync } from 'yss-trade-base';

export default {
	...publicSync,
	changeSync(state, params, { getState }) {
		state = getState();
		return state.merge({ ...params });
	},
};
