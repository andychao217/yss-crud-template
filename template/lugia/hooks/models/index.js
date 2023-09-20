/**
 * @file 注册state与异步、同步方法
 * @author $AuthorName
 * @copyright Ysstech
 */
import lugiax from '@lugia/lugiax';
import dataModel from './dataModel';
import async from '../controller/async';
import sync from '../controller/sync';

const lugiaxModel = lugiax.register({
	model: '$PageName',
	state: { ...dataModel },
	mutations: {
		async,
		sync,
	},
});

export default lugiaxModel;
