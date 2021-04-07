import { combineReducers, createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import pageReducer from './paramsOv';
import { columnsCfg } from './columnConfig';

const rootReducer = combineReducers({
	pageReducer,
});

const model = createStore(rootReducer, applyMiddleware(logger));

export {
	columnsCfg,
	model
};
