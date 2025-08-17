import { AppLayout } from "../../container/layout/app";
import { DashboardWrapper } from "./styled";

export const Dashboard = () => {
	return (
		<AppLayout pageId="Dashboard" pageTitle="Dashboard">
			<DashboardWrapper></DashboardWrapper>
		</AppLayout>
	);
};
