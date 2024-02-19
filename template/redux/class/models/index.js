// redux配置文件
import { combineReducers, createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import pageReducer from './dataModel';

const rootReducer = combineReducers({
	pageReducer,
});

const model = createStore(rootReducer, applyMiddleware(logger));

export { model };
