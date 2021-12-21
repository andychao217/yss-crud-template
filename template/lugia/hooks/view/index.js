/**
 * @file $PageName 页面主入口文件
 * @author $AuthorName
 * @Date $CreateTime
 * @copyright Ysstech
 *
 */
import React from 'react';
import { $connect, PublicProps, PageBody } from 'yss-trade-base';
import MainTable from './components/MainTable';
import { ErrorBoundary } from '@/page/public-tools';
const { PageMain } = PageBody;

/*债券评级*/
const moduleName = '$PageName';
/**
 * @class
 * @classdesc $PageName页面
 */
export default $connect((props) => {
	return (
		// 对象组件透传props
		<PublicProps.Provider value={{ ...props }}>
			<ErrorBoundary>
				<PageBody>
					<PageMain>
						<MainTable {...props} />
					</PageMain>
				</PageBody>
			</ErrorBoundary>
		</PublicProps.Provider>
	);
}, moduleName);
