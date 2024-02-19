/**
 * @author $AuthorName
 * @Date $CreateTime
 * @copyright Ysstech
 */
import React from 'react';
import MainTable from './components/MainTable';
import { UpdateStore } from '../models/actions';
import { PublicProps } from 'yss-trade-base';
import { connect } from 'react-redux';

const PageLayout = (props) => {
	return (
		// 对象组件透传props
		<PublicProps.Provider value={props}>
			<MainTable />
		</PublicProps.Provider>
	);
};

//redux state转换为props
const mapStateToProps = (state) => {
	return state.pageReducer;
};

const mapDispatchToProps = {
	dispatchUpdateStore: (params) => UpdateStore(params),
};

export default connect(mapStateToProps, mapDispatchToProps)(PageLayout);
