/**
 * @file 同步修改state方法
 * @author Andy Chao <zhaoqing@ysstech.com>
 * @copyright Ysstech
 */
export function UpdateStore(params) {
    return {
        type: 'UPDATE_STORE',
        params,
    };
}