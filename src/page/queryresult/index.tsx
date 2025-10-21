import { useEffect, useState } from "react";
import {
	Box,
	IconButton,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { QueryResultWrapper } from "./styled";
import { AppLayout } from "../../container/layout/app";
import { QueryResultTable } from "../../container/table/queryresulttable";
import { joinTablesService } from "../../util/query/runJoin";
import Cookies from "universal-cookie";
import { useQuery } from "@tanstack/react-query";
import { retrieveAllSavedQueryService } from "../../util/savedview/retrieveAllSavedQuery";
import { useParams } from "react-router-dom";
import { QueryResultFilterForm } from "../../container/form/queryresultfilter";
import { ResetIcon } from "../../asset";
import connectedTablesThumbnail from "../../asset/image/connected-tables.png";
import { ResultFilter } from "../../type/container.type";

export const QueryResult = () => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const { queryId = "" } = useParams();
	const matches = useMediaQuery("(min-width:250px)");

	const [selectedRows, setSelectedRows] = useState<number[]>([]);
	const [baseQueryResult, setBaseQueryResult] = useState<
		Record<string, any>[] | null
	>(null);
	const [queryResult, setQueryResult] = useState<Record<string, any>[] | null>(
		null
	);
	const [queryDetails, setQueryDetails] = useState<Record<string, any> | null>(
		null
	);
	const [baseResultFilter, setBaseResultFilter] = useState<ResultFilter>({
		sort: [{ field: "", value: "" }],
		filter: [{ field: "", criteria: "", value: "" }],
	});
	const [resultFilter, setResultFilter] = useState<ResultFilter>({
		sort: [{ field: "", value: "" }],
		filter: [{ field: "", criteria: "", value: "" }],
	});
	const [resultFilterFields, setResultFilterFields] = useState<string[]>([]);

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
				setBaseQueryResult(null);
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
					setBaseQueryResult(response.data);
					setQueryDetails(savedQuery?.[Number(queryId)].queryDetails);
					const fields: string[] = (response.data ?? []).flatMap(
						(result: Record<string, any>) => Object.keys(result ?? {})
					);
					const resultFilterData = savedQuery?.[Number(queryId)]?.resultFilter;
					const sanitizedResultFilter = {
						sort:
							(resultFilterData?.sort?.length ?? 0) > 0
								? resultFilterData.sort
										.sort(
											(a: { order_index: any }, b: { order_index: any }) =>
												(a.order_index ?? 0) - (b.order_index ?? 0)
										)
										.map(
											(item: { field: any; value: any; order_index: any }) => ({
												field: item.field ?? "",
												value: item.value ?? "",
												order_index: item.order_index ?? 0,
											})
										)
								: [{ field: "", value: "" }],

						filter:
							(resultFilterData?.filter?.length ?? 0) > 0
								? resultFilterData.filter.map(
										(item: { field: any; criteria: any; value: any }) => ({
											field: item.field ?? "",
											criteria: item.criteria ?? "",
											value: item.value ?? "",
										})
								  )
								: [{ field: "", criteria: "", value: "" }],
					};
					setResultFilter(sanitizedResultFilter);
					setBaseResultFilter(sanitizedResultFilter);
					setResultFilterFields(Array.from(new Set(fields)));
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

	const handleRefreshTable = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		setQueryResult(baseQueryResult);
		setResultFilter(baseResultFilter);
		return;
	};

	const isNumeric = (value: any): boolean => {
		if (value === null || value === undefined) return false;
		return !isNaN(parseFloat(value)) && isFinite(value);
	};

	const handleSorting = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		if (!baseQueryResult) return;
		let sorted = [...baseQueryResult];
		resultFilter.sort.forEach(async ({ field, value }) => {
			if (!field.trim() || !value.trim()) {
				return;
			}
			sorted.sort((a, b) => {
				const aVal = a[field];
				const bVal = b[field];
				if (aVal == null) return 1;
				if (bVal == null) return -1;
				const aIsNum = isNumeric(aVal);
				const bIsNum = isNumeric(bVal);
				if (aIsNum && bIsNum) {
					return value.toLowerCase() === "ascending"
						? parseFloat(aVal) - parseFloat(bVal)
						: parseFloat(bVal) - parseFloat(aVal);
				}
				return value.toLowerCase() === "ascending"
					? String(aVal).localeCompare(String(bVal))
					: String(bVal).localeCompare(String(aVal));
			});
		});
		setQueryResult(sorted);
	};

	const handleFiltering = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		if (!baseQueryResult) return;
		let filtered = [...baseQueryResult];
		resultFilter.filter.forEach(async ({ field, criteria, value }) => {
			if (!field.trim() || !criteria.trim() || !String(value).trim()) {
				return;
			}
			filtered = filtered.filter((row) => {
				const fieldValue = row[field];
				if (fieldValue == null) return false;
				const fieldIsNumeric = isNumeric(fieldValue);
				const valueIsNumeric = isNumeric(value);
				const left = fieldIsNumeric
					? parseFloat(fieldValue)
					: String(fieldValue).toLowerCase();
				const right = valueIsNumeric
					? parseFloat(value)
					: String(value).toLowerCase();
				switch (criteria.toLowerCase()) {
					case "equals":
						return left === right;
					case "not equals":
						return left !== right;
					case "greater than":
						if (!fieldIsNumeric || !valueIsNumeric) return false;
						return left > right;
					case "less than":
						if (!fieldIsNumeric || !valueIsNumeric) return false;
						return left < right;
					case "contains":
						if (fieldIsNumeric) return false;
						return String(fieldValue)
							.toLowerCase()
							.includes(String(value).toLowerCase());
					default:
						return true;
				}
			});
		});
		setQueryResult(filtered);
	};

	return (
		<AppLayout pageId="Saved-View" pageTitle="Query Result">
			<QueryResultWrapper>
				<Stack
					direction={{ xl: "row" }}
					alignItems={{ xl: "center" }}
					gap={"calc(var(--flex-gap)/2)"}
					justifyContent={"space-between"}
					padding={"calc(var(--basic-padding)/2)"}
				>
					<Box>
						<Typography
							variant="h3"
							fontFamily={"Inter"}
							fontWeight={600}
							fontSize={"16px"}
							lineHeight={"normal"}
							color="var(--form-header-color)"
						>
							{queryDetails?.name || "Result"}
						</Typography>
					</Box>
					<Stack
						direction={{ tablet: "row" }}
						gap={"calc(var(--flex-gap)/4)"}
						alignItems={{ tablet: "center" }}
					>
						<Box overflow={"hidden"} height={"-webkit-fill-available"}>
							<IconButton
								sx={{
									height: "inherit",
									borderRadius: "12px",
									padding: "calc(var(--basic-padding)/4)",
									backgroundColor: "var(--stepper-color)",
									width: {
										mobile: matches ? "auto" : "100%",
										tablet: "100%",
										xl: "auto",
									},
								}}
								onClick={handleRefreshTable}
							>
								<ResetIcon />
							</IconButton>
						</Box>
						<form className="query-result-filter-form">
							<QueryResultFilterForm
								formDetails={resultFilter}
								fields={resultFilterFields}
								setFormDetails={setResultFilter}
								handleSorting={handleSorting}
								handleFiltering={handleFiltering}
							/>
						</form>
					</Stack>
				</Stack>
				<Box
					component={"div"}
					className="main-area"
					padding={!queryResult ? "calc(var(--basic-padding)/2)" : 0}
				>
					{queryResult ? (
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
					) : (
						<Stack gap={"calc(var(--flex-gap)/2)"}>
							<Box overflow={"hidden"}>
								<img
									src={connectedTablesThumbnail}
									alt="connected-tables"
									className="centered-thumbnail"
								/>
							</Box>
							<Box>
								<Typography
									variant="h3"
									fontFamily={"Inter"}
									fontWeight={600}
									fontSize={"16px"}
									textAlign={"center"}
									lineHeight={"normal"}
									color="var(--no-connected-table-header-color)"
								>
									No Data Available
								</Typography>
							</Box>
							<Box>
								<Typography
									variant="body1"
									fontFamily={"Inter"}
									fontWeight={500}
									fontSize={"14px"}
									textAlign={"center"}
									lineHeight={"normal"}
									whiteSpace={"normal"}
									color="var(--subtitle-grey-color)"
								>
									Looks like nothing’s here yet. Data will show once submissions
									start coming in.
								</Typography>
							</Box>
						</Stack>
					)}
				</Box>
			</QueryResultWrapper>
		</AppLayout>
	);
};
