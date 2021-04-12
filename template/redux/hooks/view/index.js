/**
 * @file $PageName 页面主入口文件
 * @author $AuthorName
 * @copyright Ysstech
 */
import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { PageBody } from 'yss-trade-base';

import MainTable from './components/MainTable';
import ErrorBoundary from '../../public-tools/ErrorBoundary';
import { model } from '../models';

const { PageMain } = PageBody;

/**
 * @class
 * @classdesc $PageName页面
 */
export default class $PageName extends PureComponent {
	render() {
		return (
			// 对象组件透传props
			<Provider store={model}>
				<ErrorBoundary>
					<PageBody>
						<PageMain>
							<MainTable />
						</PageMain>
					</PageBody>
				</ErrorBoundary>
			</Provider>
		);
	}
};
