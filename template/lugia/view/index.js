/**
 * @file $PageName 页面主入口文件
 * @author Andy Chao <zhaoqing@ysstech.com>
 * @copyright Ysstech
 */
import React from 'react';
import { $connect, PublicProps, PageBody } from 'yss-trade-base';
import MainTable from './components/MainTable';
//import ErrorBoundary from '../../public-tools/ErrorBoundary';
const { PageMain, Container, Plate } = PageBody;

const moduleName = '$PageName';

/**
 * @class
 * @classdesc $PageName页面
 */
 export default $connect((props) => {
	return (
		// 对象组件透传props
		<PublicProps.Provider value={{ ...props }}>
			{/* <ErrorBoundary> */}
				<PageBody>
					<PageMain style={{ padding: '0px 10px' }}>
						<Plate>
							<Container>
								<MainTable {...props} />
							</Container>
						</Plate>
					</PageMain>
				</PageBody>
			{/* </ErrorBoundary> */}
		</PublicProps.Provider>
	);
}, moduleName);
