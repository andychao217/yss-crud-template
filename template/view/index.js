import React from 'react';
import { $connect, PublicProps, PageBody } from 'yss-trade-base';
import MainTable from './components/MainTable';
import ErrorBoundary from '../../public-tools/ErrorBoundary';
const { PageMain, Container } = PageBody;

const moduleName = 'Table-manage';

const TableManage = (props) => {
	return (
		// 对象组件透传props
		<PublicProps.Provider value={{ ...props }}>
			<ErrorBoundary>
				<PageBody>
					<PageMain style={{ padding: '0px 10px' }}>
						<Container>
							<MainTable {...preps} />
						</Container>
					</PageMain>
				</PageBody>
		</PublicProps.Provider>
	);
};

export default $connect(TableManage, moduleName);
