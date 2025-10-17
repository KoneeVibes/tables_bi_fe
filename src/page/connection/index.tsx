import { useContext, useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";
import {
	Box,
	CircularProgress,
	IconButton,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { BaseButton } from "../../component/button/styled";
import { AppLayout } from "../../container/layout/app";
import { ConnectionWrapper } from "./styled";
import { retrieveAllTableService } from "../../util/query/retrieveAllTable";
import dbIcon from "../../asset/icon/bw-db-icon.svg";
import { DatasourceSwitchForm } from "../../container/form/datasourceswitch";
import { SelectDbTableField } from "../../container/form/selectdbtablefield";
import connectedTablesThumbnail from "../../asset/image/connected-tables.png";
import { ResetIcon, SearchIconPrimaryColorVariant } from "../../asset";
import { SearchIconLightColorVariant } from "../../asset";
import { QueryResultFilterForm } from "../../container/form/queryresultfilter";
import { retrieveAllTableFieldService } from "../../util/query/retrieveAllTableFields";
import { ConnectedTable } from "../../container/form/connectedtable";
import { joinTablesService } from "../../util/query/runJoin";
import { retrieveTableRelationshipService } from "../../util/query/retrieveTableRelationship";
import { retrieveAllTableRelationshipService } from "../../util/query/retrieveAllTableRelationship";
import { AppContext } from "../../context/appContext";
import { QueryResultTable } from "../../container/table/queryresulttable";
import { saveQueryService } from "../../util/query/saveQuery";
import { SaveQueryForm } from "../../container/form/savequery";
import { BaseAlertModal } from "../../component/modal/alert";
import confetti from "../../asset/image/success-confetti.png";
import { useNavigate } from "react-router-dom";

export const Connection = () => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const navigate = useNavigate();
	const matches = useMediaQuery("(min-width:250px)");
	const { joinTableCount, setJoinTableCount } = useContext(AppContext);

	const [isJoining, setIsJoining] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [joiningError, setJoiningError] = useState<string | null>(null);
	const [saveQueryError, setSaveQueryError] = useState<string | null>(null);
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [queryResult, setQueryResult] = useState<Record<string, any>[] | null>(
		null
	);
	const [selectedRows, setSelectedRows] = useState<number[]>([]);
	const [isSaveQueryFormModalOpen, setIsSaveQueryFormModalOpen] =
		useState(false);
	const [queryName, setQueryName] = useState<string>("");
	const [dataSource] = useState<Record<string, any>>(
		localStorage.getItem("dataSource")
			? JSON.parse(localStorage.getItem("dataSource") as string)
			: { name: "" }
	);
	const [resultFilter, setResultFilter] = useState<Record<string, any>>({
		group: "status",
		sort: "ascending",
		filter: "all",
	});
	const [dbTables, setDbTables] = useState<Record<string, any>[]>([]);
	const [tableRelationship, setTableRelationship] = useState<Record<
		string,
		any
	> | null>(null);
	const [connectedTable, setConnectedTable] = useState<Record<
		string,
		Record<string, any>[]
	> | null>(null);
	const [connectedTableFields, setConnectedTableFields] = useState<Record<
		string,
		any[]
	> | null>(null);
	const [dbTableFields, setDbTableFields] = useState<Record<string, any>[]>([]);
	const [datasourceDetails, setDatasourceDetails] = useState<
		Record<string, any>
	>({
		primaryTable: " ",
		secondaryTable_0: " ",
		primaryTableFields: [],
		secondaryTable_0_Fields: [],
	});

	const datasourceDetailRef = useRef(datasourceDetails);
	useEffect(() => {
		datasourceDetailRef.current = datasourceDetails;
	}, [datasourceDetails]);

	useEffect(() => {
		const handleRetrieveAllTable = async () => {
			if (!dataSource.name) {
				console.error("Please select a datasource to proceed.");
				return;
			}
			try {
				const response = await retrieveAllTableService(TOKEN, dataSource.name);
				if (response.status === "success") {
					setDbTables(response.data);
				} else {
					console.error("Please check your credentials and try again.");
				}
			} catch (error: any) {
				console.error("Failed to retrieve all table:", error);
			}
		};
		handleRetrieveAllTable();
	}, [TOKEN, dataSource.name]);

	useEffect(() => {
		const handleRetrieveAllTableFields = async () => {
			if (!dataSource.name) {
				console.error("Please select a datasource to proceed.");
				return;
			}
			if (!datasourceDetails.primaryTable.trim()) {
				setDbTableFields([]);
				console.error("Please select a table to proceed.");
				return;
			}
			try {
				const response = await retrieveAllTableFieldService(
					TOKEN,
					dataSource.name,
					datasourceDetails.primaryTable
				);
				if (response.status === "success") {
					setDbTableFields(response.data);
				} else {
					console.error("Please check your credentials and try again.");
				}
			} catch (error: any) {
				console.error("Failed to retrieve all table fields:", error);
			}
		};
		handleRetrieveAllTableFields();
	}, [TOKEN, dataSource.name, datasourceDetails.primaryTable]);

	useEffect(() => {
		const handleRetrieveTableRelationship = async () => {
			if (!dataSource.name) {
				console.error("Please select a datasource to proceed.");
				return;
			}
			if (!datasourceDetails.primaryTable.trim()) {
				setTableRelationship(null);
				console.error("Please select a table to proceed.");
				return;
			}
			try {
				const response = await retrieveTableRelationshipService(
					TOKEN,
					dataSource.name,
					datasourceDetails.primaryTable
				);
				if (response.status === "success") {
					setTableRelationship(response.data);
				} else {
					console.error("Please check your credentials and try again.");
				}
			} catch (error: any) {
				console.error("Failed to retrieve connected tables:", error);
			}
		};
		handleRetrieveTableRelationship();
	}, [TOKEN, dataSource.name, datasourceDetails.primaryTable]);

	useEffect(() => {
		if (!tableRelationship) {
			setConnectedTable(null);
			return;
		}
		const updatedConnectedTables: Record<string, any[]> = {};
		let accumulated: any[] = [];
		Object.entries(datasourceDetailRef.current).forEach(([key, value]) => {
			if (key.endsWith("Fields")) return;
			const tableName = typeof value === "string" ? value.trim() : "";
			if (!tableName) return;
			const relArray = Array.isArray(tableRelationship[tableName])
				? tableRelationship[tableName]
				: [];
			accumulated = [...accumulated, ...relArray];
			if (key === "primaryTable") {
				updatedConnectedTables["secondaryTable_0"] = [...accumulated];
			} else if (key.startsWith("secondaryTable_")) {
				const index = parseInt(key.split("_")[1], 10);
				updatedConnectedTables[`secondaryTable_${index + 1}`] = [
					...accumulated,
				];
			}
		});
		setConnectedTable(updatedConnectedTables);
	}, [tableRelationship]);

	useEffect(() => {
		if (!connectedTable || !dataSource?.name) {
			setConnectedTableFields(null);
			return;
		}
		const handleRetrieveConnectedTableFields = async () => {
			try {
				const tableNames = Object.entries(datasourceDetails)
					.filter(
						([key, value]) =>
							!key.endsWith("Fields") &&
							typeof value === "string" &&
							value.trim() !== ""
					)
					.map(([_, value]) => value.trim());
				const results = await Promise.all(
					tableNames.map(async (tableName) => {
						try {
							const response = await retrieveAllTableFieldService(
								TOKEN,
								dataSource.name,
								tableName
							);
							return { tableName, fields: response?.data || [] };
						} catch (err) {
							console.error(`Failed to fetch fields for ${tableName}:`, err);
							return { tableName, fields: [] };
						}
					})
				);
				const updatedFields: Record<string, any[]> = {};
				Object.entries(datasourceDetailRef.current).forEach(([key, value]) => {
					if (key.endsWith("Fields")) return;
					const tableName = typeof value === "string" ? value.trim() : "";
					if (!tableName) return;
					const result = results.find((r) => r.tableName.trim() === tableName);
					if (!result) {
						console.warn(`No result found for table: ${tableName}`);
						return;
					}
					if (key === "primaryTable") {
						updatedFields["primaryTableFields"] = result.fields;
					} else if (key.startsWith("secondaryTable_")) {
						updatedFields[`${key}_Fields`] = result.fields;
					}
				});
				setConnectedTableFields(updatedFields);
			} catch (err) {
				console.error("Error fetching connected table fields:", err);
			}
		};
		handleRetrieveConnectedTableFields();
	}, [TOKEN, connectedTable, dataSource?.name, datasourceDetails]);

	useEffect(() => {
		if (joinTableCount === 0) return;
		setDatasourceDetails((prev) => {
			const newKey = `secondaryTable_${joinTableCount}`;
			if (prev[newKey] !== undefined) return prev;
			return {
				...prev,
				[newKey]: " ",
				[`${newKey}_Fields`]: [],
			};
		});
	}, [joinTableCount]);

	// temporary fix for re-retrieving table relationship when user modifies datasourceDetails
	// temporary because formerly, we only re-retrieve relationship when user adds a new table to join on
	// and while this is not enough, because user can also modify existing table selection, I have not
	// thought hard enough of the side effect of this re-retrieval on datasourceDetail modification,
	// so I will revisit this later, either to replace this with a permanent solution or delete this comment.
	useEffect(() => {
		const fetchRelationships = async () => {
			await handleRetrieveAllTableRelationship();
		};
		fetchRelationships();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [datasourceDetails]);

	const handleRetrieveAllTableRelationship = async (): Promise<boolean> => {
		if (!dataSource.name) {
			console.error("Please select a datasource to proceed.");
			return false;
		}
		const payloadSet = new Set<string>();
		if (
			datasourceDetails.primaryTable &&
			datasourceDetails.primaryTable.trim() !== ""
		) {
			payloadSet.add(datasourceDetails.primaryTable.trim());
		}
		Object.entries(datasourceDetails).forEach(([key, value]) => {
			if (key.startsWith("secondaryTable_") && !key.endsWith("_Fields")) {
				if (typeof value === "string" && value.trim() !== "") {
					payloadSet.add(value.trim());
				}
			}
		});
		const payload = Array.from(payloadSet);
		try {
			const response = await retrieveAllTableRelationshipService(
				TOKEN,
				dataSource.name,
				payload
			);
			if (response.status === "success") {
				setTableRelationship(response.data);
				return true;
			} else {
				console.error("Please check your credentials and try again.");
				return false;
			}
		} catch (error: any) {
			console.error("Failed to retrieve connected tables:", error);
			return false;
		}
	};

	const handleResetResultFilter = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
	};

	const handleAddTable = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		const prevKey = `secondaryTable_${joinTableCount}`;
		if (
			!datasourceDetails[prevKey] ||
			datasourceDetails[prevKey].trim() === ""
		) {
			console.warn(`Please fill in ${prevKey} before adding another table.`);
			return;
		}
		const hasRelationship = await handleRetrieveAllTableRelationship();
		if (!hasRelationship) return; //probably show a modal to say that there is no table with a relationship;
		return setJoinTableCount((prev) => prev + 1);
	};

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

	const handleJoinTable = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		setJoiningError(null);
		setQueryResult(null);
		setIsJoining(true);
		if (!dataSource.name) {
			console.error("Please select a datasource to proceed.");
			return;
		}
		try {
			const payload = {
				datasourceDetails,
				tableRelationship,
			};
			const filter = { checkForActiveConnection: true };
			const response = await joinTablesService(
				TOKEN,
				dataSource.name,
				payload,
				filter
			);
			if (response.status === "success") {
				setIsJoining(false);
				setQueryResult(response.data);
			} else {
				setIsJoining(false);
				setJoiningError(
					"Join tables failed. Please check your credentials and try again."
				);
			}
		} catch (error: any) {
			setIsJoining(false);
			setJoiningError(`Join tables failed. ${error.message}`);
			console.error("Join tables failed:", error);
		}
	};

	const handleOpenSaveQueryFormModal = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		return setIsSaveQueryFormModalOpen(true);
	};

	const handleAlertModalPersist = () => {
		if (isSaving) return;
		setIsAlertModalOpen(false);
	};

	const handleNavigateToConnection = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		handleAlertModalPersist();
		return navigate("/saved-view");
	};

	const handleSaveQuery = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSaving(true);
		setSaveQueryError(null);
		if (!dataSource.name) {
			console.error("Please select a datasource to proceed.");
			return;
		}
		if (!queryName.trim()) {
			setSaveQueryError("Please enter a query name.");
			return;
		}
		const cleanedDatasourceDetails = Object.entries(datasourceDetails).reduce(
			(acc, [key, value]) => {
				if (typeof value === "string" && value.trim() === "") return acc;
				if (Array.isArray(value) && value.length === 0) return acc;
				acc[key] = value;
				return acc;
			},
			{} as typeof datasourceDetails
		);
		try {
			const payload = {
				queryName,
				tableRelationship,
				datasourceDetails: cleanedDatasourceDetails,
			};
			const response = await saveQueryService(TOKEN, dataSource.name, payload);
			if (response.status === "success") {
				setQueryName("");
				setIsSaving(false);
				setIsAlertModalOpen(true);
				setIsSaveQueryFormModalOpen(false);
			} else {
				setIsSaving(false);
				setSaveQueryError("Save query failed. Please try again.");
			}
		} catch (error: any) {
			setIsSaving(false);
			setSaveQueryError(`Save query failed. ${error.message}`);
			console.error("Save query failed:", error);
		}
	};

	const alertIcon = (
		<Box
			component={"div"}
			className={`alert-modal-item alert-modal-icon alert-modal-confetti-icon`}
		>
			<img src={confetti} alt={"Success Confetti"} />
		</Box>
	);

	const alertHeader = (
		<Box component={"div"} className="alert-modal-item alert-modal-header">
			<Typography
				variant="h3"
				fontFamily={"Inter"}
				fontWeight={600}
				fontSize={"20px"}
				lineHeight={"normal"}
				color="var(--form-header-color)"
				textAlign={"center"}
				whiteSpace={"normal"}
			>
				Query Added Successfully
			</Typography>
		</Box>
	);

	const alertBody = (
		<Stack className="alert-modal-item alert-modal-body">
			<Box>
				<Typography
					variant="body1"
					fontFamily={"Inter"}
					fontWeight={500}
					fontSize={"14px"}
					lineHeight={"normal"}
					color="var(--form-header-color)"
					textAlign={"center"}
					whiteSpace={"normal"}
				>
					Your query has been added successfully.
				</Typography>
			</Box>
			<Box overflow={"hidden"}>
				<BaseButton
					disableElevation
					variant="contained"
					sx={{ width: "100%" }}
					onClick={handleNavigateToConnection}
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
						Continue to Saved View
					</Typography>
				</BaseButton>
			</Box>
		</Stack>
	);

	return (
		<AppLayout pageId="Connection" pageTitle="Connections">
			<ConnectionWrapper>
				<BaseAlertModal
					open={isAlertModalOpen}
					icon={alertIcon}
					header={alertHeader}
					body={alertBody}
					className="alert-modal"
					handleClose={handleAlertModalPersist}
				/>
				<SaveQueryForm
					isLoading={isSaving}
					queryName={queryName}
					error={saveQueryError}
					setQueryName={setQueryName}
					handleSubmit={handleSaveQuery}
					isOpen={isSaveQueryFormModalOpen}
					setIsOpen={setIsSaveQueryFormModalOpen}
				/>
				<Stack className="data-source-stack">
					<Stack
						direction={"row"}
						alignItems={"center"}
						gap={"calc(var(--flex-gap)/4)"}
					>
						<Box overflow={"hidden"}>
							<img src={dbIcon} alt="db-icon" />
						</Box>
						<Box overflow={"hidden"}>
							<Typography
								variant="h2"
								fontFamily={"Inter"}
								fontWeight={600}
								fontSize={"16px"}
								lineHeight={"normal"}
								color="var(--form-header-color)"
							>
								Data Source
							</Typography>
						</Box>
					</Stack>
					<form>
						<DatasourceSwitchForm
							tables={dbTables}
							formDetails={datasourceDetails}
							setFormDetails={setDatasourceDetails}
						/>
					</form>
				</Stack>
				<Stack className="query-builder-and-result-stack">
					<Stack className="query-builder-stack">
						<Box>
							<Typography
								variant="h2"
								fontFamily={"Inter"}
								fontWeight={600}
								fontSize={"20px"}
								lineHeight={"normal"}
								color="var(--dark-color)"
							>
								Query Builder
							</Typography>
						</Box>
						<form>
							<SelectDbTableField
								fields={dbTableFields}
								formDetails={datasourceDetails}
								setFormDetails={setDatasourceDetails}
							/>
						</form>
						<Stack className="connected-tables-area">
							<Stack
								justifyContent={"space-between"}
								direction={{ miniTablet: "row" }}
								alignItems={{ miniTablet: "center" }}
								gap={{
									mobile: "calc(var(--flex-gap)/4)",
									miniTablet: "calc(var(--flex-gap)/2)",
								}}
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
										Connected Tables
									</Typography>
								</Box>
								<Box overflow={"hidden"}>
									<BaseButton
										variant="outlined"
										disableElevation
										padding="calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)"
										startIcon={
											<Typography
												variant="subtitle1"
												fontFamily={"inherit"}
												fontWeight={500}
												fontSize={"12px"}
												lineHeight={"inherit"}
												color="inherit"
											>
												+
											</Typography>
										}
										sx={{ width: matches ? "auto" : "100%" }}
										onClick={handleAddTable}
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
											Join Table
										</Typography>
									</BaseButton>
								</Box>
							</Stack>
							<Box
								component={"div"}
								className={`main-area ${
									(datasourceDetails?.primaryTableFields ?? []).length > 0 &&
									"reduce-padding"
								}`}
							>
								{(datasourceDetails?.primaryTableFields ?? []).length <= 0 ? (
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
												No Connected Tables
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
												No connected tables. Click "Join Table" to connect data
												from multiple tables.
											</Typography>
										</Box>
									</Stack>
								) : (
									<form className="connected-table">
										<ConnectedTable
											tableName="secondaryTable_0"
											fieldName="secondaryTable_0_Fields"
											tables={connectedTable?.["secondaryTable_0"] ?? []}
											fields={
												connectedTableFields?.["secondaryTable_0_Fields"] ?? []
											}
											formDetails={datasourceDetails}
											setFormDetails={setDatasourceDetails}
											setTableRelationship={setTableRelationship}
										/>
										{Array.from({ length: joinTableCount }).map((_, index) => {
											const idx = index + 1;
											return (
												<ConnectedTable
													key={idx}
													tableName={`secondaryTable_${idx}`}
													fieldName={`secondaryTable_${idx}_Fields`}
													tables={
														connectedTable?.[`secondaryTable_${idx}`] ?? []
													}
													fields={
														connectedTableFields?.[
															`secondaryTable_${idx}_Fields`
														] ?? []
													}
													formDetails={datasourceDetails}
													setFormDetails={setDatasourceDetails}
													setTableRelationship={setTableRelationship}
												/>
											);
										})}
									</form>
								)}
							</Box>
							<Box overflow={"hidden"} marginLeft={matches ? "auto" : 0}>
								<BaseButton
									variant="contained"
									disableElevation
									disabled={isJoining}
									bgcolor="var(--stepper-color)"
									padding="calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)"
									startIcon={<SearchIconPrimaryColorVariant />}
									sx={{ width: matches ? "auto" : "100%" }}
									onClick={handleJoinTable}
								>
									<Box sx={{ position: "relative" }}>
										{isJoining && (
											<CircularProgress color="inherit" className="loader" />
										)}
										<Typography
											variant={"button"}
											fontFamily={"inherit"}
											fontWeight={"inherit"}
											fontSize={"inherit"}
											lineHeight={"inherit"}
											color={"var(--primary-color)"}
											textTransform={"inherit"}
											visibility={isJoining ? "hidden" : "visible"}
										>
											Run Query
										</Typography>
									</Box>
								</BaseButton>
							</Box>
						</Stack>
					</Stack>
					<Stack className="result-stack">
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
									Results
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
										onClick={handleResetResultFilter}
									>
										<ResetIcon />
									</IconButton>
								</Box>
								<form className="query-result-filter-form">
									<QueryResultFilterForm
										formDetails={resultFilter}
										setFormDetails={setResultFilter}
									/>
								</form>
								<Box overflow={"hidden"} height={"-webkit-fill-available"}>
									<BaseButton
										disabled={
											isSaving || !queryResult || queryResult.length === 0
										}
										disableElevation
										variant="contained"
										sx={{
											height: "inherit",
											width: {
												mobile: matches ? "auto" : "100%",
												tablet: "100%",
												xl: "auto",
											},
										}}
										startIcon={<SearchIconLightColorVariant />}
										padding="calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)"
										onClick={handleOpenSaveQueryFormModal}
									>
										<Typography
											variant={"button"}
											fontFamily={"inherit"}
											fontWeight={"inherit"}
											fontSize={"inherit"}
											lineHeight={"inherit"}
											color={"inherit"}
											textTransform={"inherit"}
											visibility={isSaving ? "hidden" : "visible"}
										>
											Save Table
										</Typography>
									</BaseButton>
								</Box>
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
											queryResult.length > 0 ? Object.keys(queryResult[0]) : []
										}
										rows={queryResult as Record<string, any>[]}
										selectedRows={selectedRows}
										handleCheckRow={handleCheckRow}
										handleCheckAllRow={handleCheckAllRow}
									/>
								</Box>
							) : joiningError ? (
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
										{joiningError}
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
											Looks like nothing’s here yet. Data will show once
											submissions start coming in.
										</Typography>
									</Box>
								</Stack>
							)}
						</Box>
					</Stack>
				</Stack>
			</ConnectionWrapper>
		</AppLayout>
	);
};
