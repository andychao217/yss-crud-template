import React from 'react';
import { $connect, PublicProps, PageBody } from 'yss-trade-base';
import IssuersTable from './components/IssuersTable';
const { PageMain, Container } = PageBody;

const moduleName = 'issuers-manage';

const IssuersManage = (props) => {
	return (
		// 对象组件透传props
		<PublicProps.Provider value={{ ...props }}>
			<PageBody>
				<PageMain style={{ padding: '0px 10px' }}>
					<Container>
						<IssuersTable />
					</Container>
				</PageMain>
			</PageBody>
		</PublicProps.Provider>
	);
};

export default $connect(IssuersManage, moduleName);
