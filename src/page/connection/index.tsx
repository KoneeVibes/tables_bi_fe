import { Typography } from "@mui/material";
import { BaseButton } from "../../component/button/styled";
import { AppLayout } from "../../container/layout/app";
import { ConnectionWrapper } from "./styled";
import { retrieveAllTableService } from "../../util/query/retrieveAllTable";
import Cookies from "universal-cookie";
import { useState } from "react";

export const Connection = () => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const [dataSource] = useState<Record<string, any>>(
		localStorage.getItem("dataSource")
			? JSON.parse(localStorage.getItem("dataSource") as string)
			: { name: "" }
	);
	const [names, setNames] = useState([]);

	const handleRetrieveAllTable = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		if (!dataSource.name) {
			return console.log("Please select a datasource to proceed.");
		}
		try {
			const response = await retrieveAllTableService(TOKEN, dataSource.name);
			if (response.status === "success") {
				setNames(response.data);
			} else {
				console.log("Please check your credentials and try again.");
			}
		} catch (error: any) {
			console.error("Test failed:", error);
		}
	};

	return (
		<AppLayout pageId="Connection" pageTitle="Connections">
			<ConnectionWrapper>
				<BaseButton
					disableElevation
					variant="contained"
					onClick={handleRetrieveAllTable}
				>
					<Typography
						variant={"button"}
						fontFamily={"inherit"}
						fontWeight={"inherit"}
						fontSize={"inherit"}
						lineHeight={"inherit"}
						color={"inherit"}
						textTransform={"inherit"}
					>
						Test
					</Typography>
				</BaseButton>
				{names?.map((name: Record<string, any>, index) => (
					<h1 key={index}>{name.table_name}</h1>
				))}
			</ConnectionWrapper>
		</AppLayout>
	);
};
