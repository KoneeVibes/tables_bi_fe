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
import { ResetIcon, SearchIconLightColorVariant } from "../../asset";
import connectedTablesThumbnail from "../../asset/image/connected-tables.png";
import { ResultFilter } from "../../type/container.type";
import { BaseButton } from "../../component/button/styled";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const QueryResult = () => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const { queryId = "" } = useParams();
	const matches = useMediaQuery("(min-width:250px)");

	const [selectedRows, setSelectedRows] = useState<number[]>([]);
	const [baseQueryResult, setBaseQueryResult] = useState<
		Record<string, any>[] | null
	>(null);
	const [isExporting, setIsExporting] = useState(false);
	const [exportError, setExportError] = useState<string | null>(null);
	const [queryResult, setQueryResult] = useState<Record<string, any>[] | null>(
		null
	);
	const [queryDetails, setQueryDetails] = useState<Record<string, any> | null>(
		null
	);
	const [baseResultFilter, setBaseResultFilter] = useState<ResultFilter>({
		sort: [{ field: "", value: "" }],
		filter: [
			{ field: "", type: "", criteria: "", value: "", start: "", end: "" },
		],
	});
	const [resultFilter, setResultFilter] = useState<ResultFilter>({
		sort: [{ field: "", value: "" }],
		filter: [
			{ field: "", type: "", criteria: "", value: "", start: "", end: "" },
		],
	});
	const [resultFilterFields, setResultFilterFields] = useState<
		{ name: string; type: string }[]
	>([]);

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
					const fields: { name: string; type: string }[] = (
						response.data ?? []
					).flatMap((row: Record<string, any>) =>
						Object.entries(row ?? {}).map(([key, value]) => ({
							name: key,
							type: value?.type ?? "unknown",
						}))
					);
					const uniqueFields = Array.from(
						new Map(fields.map((f) => [f.name, f])).values()
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
										(item: {
											field: any;
											type: any;
											criteria: any;
											value: any;
											start: any;
											end: any;
										}) => ({
											field: item.field ?? "",
											type: item.type ?? "",
											criteria: item.criteria ?? "",
											value: item.value ?? "",
											start: "",
											end: "",
										})
								  )
								: [
										{
											field: "",
											type: "",
											criteria: "",
											value: "",
											start: "",
											end: "",
										},
								  ],
					};
					setResultFilter(sanitizedResultFilter);
					setBaseResultFilter(sanitizedResultFilter);
					setResultFilterFields(uniqueFields);
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

	const handleApplyFiltersAndSorting = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.stopPropagation();
		if (!baseQueryResult) return;
		let result = [...baseQueryResult];
		resultFilter.filter.forEach(
			({ field, criteria, type, value, start, end }) => {
				if (!field.trim() || !criteria.trim()) return;
				const isBetween = criteria.toLowerCase() === "between";
				const isDateType = ["date", "timestamp", "timestamptz"].includes(type);
				if (!isBetween && !String(value).trim()) return;
				result = result.filter((row) => {
					const fieldValue = row[field]?.value;
					if (fieldValue == null) return false;
					if (isBetween && isDateType) {
						if (!start || !end) return true;
						const rowDate = new Date(fieldValue);
						const startDate = new Date(start);
						const endDate = new Date(end);
						rowDate.setHours(0, 0, 0, 0);
						startDate.setHours(0, 0, 0, 0);
						endDate.setHours(23, 59, 59, 999);
						return rowDate >= startDate && rowDate <= endDate;
					}
					const fieldIsNumeric = isNumeric(fieldValue);
					const valueIsNumeric = isNumeric(value);
					const left = fieldIsNumeric
						? parseFloat(fieldValue)
						: String(fieldValue).toLowerCase().trim();
					const right = valueIsNumeric
						? parseFloat(value)
						: String(value).toLowerCase().trim();
					switch (criteria.toLowerCase()) {
						case "equals":
							return left === right;
						case "not equals":
							return left !== right;
						case "greater than":
							return fieldIsNumeric && valueIsNumeric && left > right;
						case "less than":
							return fieldIsNumeric && valueIsNumeric && left < right;
						case "contains":
							return (
								!fieldIsNumeric &&
								String(fieldValue)
									.toLowerCase()
									.includes(String(value).toLowerCase())
							);
						default:
							return true;
					}
				});
			}
		);
		resultFilter.sort.forEach(({ field, value }) => {
			if (!field.trim() || !value.trim()) return;
			result.sort((a, b) => {
				const aVal = a[field]?.value;
				const bVal = b[field]?.value;
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
		setQueryResult(result);
	};

	const handleExportQuery = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		setIsExporting(true);
		setExportError(null);
		if (!queryResult || queryResult.length <= 0) {
			setExportError("No query result available to export.");
			setIsExporting(false);
			return;
		}
		try {
			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet("Query Table");
			const columns =
				queryResult.length > 0
					? Object.keys(queryResult[0]).map((key) => ({
							header: key,
							key,
							width: 20,
					  }))
					: [];

			worksheet.columns = columns;
			worksheet.addRows(queryResult);

			worksheet.getRow(1).font = { bold: true };
			worksheet.getRow(1).alignment = { horizontal: "center" };

			const buffer = await workbook.xlsx.writeBuffer();
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			saveAs(blob, `TablesBI - Query Table.xlsx`);
			setIsExporting(false);
		} catch (error) {
			setIsExporting(false);
			const errorMessage =
				error instanceof Error ? error.message : "An unexpected error occurred";
			setExportError(`Query export failed. ${errorMessage}`);
			console.error("Query export failed:", error);
		}
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
						flex={{ xl: 0.5 }}
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
								handleSorting={handleApplyFiltersAndSorting}
								handleFiltering={handleApplyFiltersAndSorting}
							/>
						</form>
						<Stack className="query-result-call-to-action">
							<Box
								overflow={"hidden"}
								height={"-webkit-fill-available"}
								width={{ mobile: "100%", miniTablet: "auto", xl: "100%" }}
							>
								<BaseButton
									disabled={
										isExporting || !queryResult || queryResult.length === 0
									}
									disableElevation
									variant="contained"
									sx={{
										height: "inherit",
										width: "100%",
									}}
									startIcon={<SearchIconLightColorVariant />}
									padding="calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)"
									onClick={handleExportQuery}
								>
									<Typography
										variant={"button"}
										fontFamily={"inherit"}
										fontWeight={"inherit"}
										fontSize={"inherit"}
										lineHeight={"inherit"}
										color={"inherit"}
										textTransform={"inherit"}
										visibility={isExporting ? "hidden" : "visible"}
									>
										Export
									</Typography>
								</BaseButton>
							</Box>
						</Stack>
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
					) : exportError ? (
						<Box>
							<Typography
								fontFamily={"Inter"}
								fontWeight={"600"}
								fontSize={14}
								lineHeight={"normal"}
								color={"var(--error-red-color)"}
								whiteSpace={"normal"}
								textAlign={"center"}
							>
								{exportError}
							</Typography>
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
