import lugiax from '@lugia/lugiax';
import paramsOv from './paramsOv';
import async from '../controller/async';
import sync from '../controller/sync';

const lugiaxModel = lugiax.register({
	model: 'Table-manage',
	state: { ...paramsOv },
	mutations: {
		async,
		sync,
	},
});

export default lugiaxModel;
