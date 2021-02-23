/**
 * @file Table-manage页面主入口文件
 * @author Andy Chao <zhaoqing@ysstech.com>
 * @copyright Ysstech
 */
import React from 'react';
import { $connect, PublicProps, PageBody } from 'yss-trade-base';
import MainTable from './components/MainTable';
import ErrorBoundary from '../../public-tools/ErrorBoundary';
const { PageMain, Container, Plate } = PageBody;

const moduleName = 'Table-manage';

/**
 * @class
 * @classdesc Table-manage页面
 */
const TableManage = (props) => {
	return (
		// 对象组件透传props
		<PublicProps.Provider value={{ ...props }}>
			<ErrorBoundary>
				<PageBody>
					<PageMain style={{ padding: '0px 10px' }}>
						<Plate>
							<Container>
								<MainTable {...props} />
							</Container>
						</Plate>
					</PageMain>
				</PageBody>
			</ErrorBoundary>
		</PublicProps.Provider>
	);
};

export default $connect(TableManage, moduleName);
