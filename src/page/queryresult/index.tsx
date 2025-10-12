import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { QueryResultWrapper } from "./styled";
import { AppLayout } from "../../container/layout/app";
import { QueryResultTable } from "../../container/table/queryresulttable";
import { joinTablesService } from "../../util/query/runJoin";
import Cookies from "universal-cookie";
import { useQuery } from "@tanstack/react-query";
import { retrieveAllSavedQueryService } from "../../util/savedview/retrieveAllSavedQuery";
import { useParams } from "react-router-dom";

export const QueryResult = () => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const { queryId = "" } = useParams();

	const [selectedRows, setSelectedRows] = useState<number[]>([]);
	const [queryResult, setQueryResult] = useState<Record<string, any>[] | null>(
		null
	);

	const { data: savedQuery } = useQuery({
		queryKey: ["savedQuery", TOKEN],
		queryFn: async () => {
			return await retrieveAllSavedQueryService(TOKEN);
		},
		enabled: !!TOKEN,
	});

	useEffect(() => {
		const joinTables = async () => {
			if (!queryId?.trim() && !savedQuery) return; // only run when queryId is non-empty
			try {
				setQueryResult(null);
				const connectionConfig =
					savedQuery?.[Number(queryId)]?.connectionConfig;
				if (!connectionConfig) return;
				const payload = {
					connectionConfig,
					datasourceDetails: savedQuery?.[Number(queryId)]?.datasourceDetails,
					tableRelationship: savedQuery?.[Number(queryId)]?.tableRelationships,
				};
				const filter = { checkForActiveConnection: false };
				const response = await joinTablesService(
					TOKEN,
					connectionConfig?.dbType,
					payload,
					filter
				);
				if (response.status === "success") {
					setQueryResult(response.data);
				} else {
					console.error(
						"Join tables failed. Please check your credentials and try again."
					);
				}
			} catch (error: any) {
				console.error("Join tables failed:", error);
			}
		};

		joinTables();
	}, [queryId, TOKEN, savedQuery]);

	const handleCheckRow = (
		e: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => {
		e.stopPropagation();
		setSelectedRows((prev) =>
			prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
		);
	};

	const handleCheckAllRow = (
		e: React.ChangeEvent<HTMLInputElement>,
		checked: boolean
	) => {
		e.stopPropagation();
		if (checked) {
			const newSelected = queryResult?.map((n, index) => index);
			setSelectedRows(newSelected ?? []);
			return;
		}
		setSelectedRows([]);
	};

	return (
		<AppLayout pageId="Saved-View" pageTitle="Query Result">
			<QueryResultWrapper>
				<Box>
					<QueryResultTable
						headers={
							queryResult && queryResult.length > 0
								? Object.keys(queryResult[0])
								: []
						}
						rows={queryResult as Record<string, any>[]}
						selectedRows={selectedRows}
						handleCheckRow={handleCheckRow}
						handleCheckAllRow={handleCheckAllRow}
					/>
				</Box>
			</QueryResultWrapper>
		</AppLayout>
	);
};
