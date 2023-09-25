/**
 * @file $pageClassName 页面主入口文件
 * @author $AuthorName
 * @Date $CreateTime
 * @copyright Ysstech
 */
import React, { PureComponent } from 'react';
import { Provider } from 'react-redux';
import { PageBody } from 'yss-trade-base';
import PageLayout from './pageLayout';
import { ErrorBoundary } from '@/page/public-tools';
import { model } from '../models';
const { PageMain } = PageBody;

/**
 * @class
 * @classdesc $pageClassName页面
 */
export default class $pageClassName extends PureComponent {
	render() {
		return (
			// 对象组件透传props
			<Provider store={model}>
				<ErrorBoundary>
					<PageBody>
						<PageMain>
							<PageLayout />
						</PageMain>
					</PageBody>
				</ErrorBoundary>
			</Provider>
		);
	}
}
