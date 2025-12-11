import { useCallback, useContext, useEffect, useRef, useState } from "react";
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
import { DatabaseLightColorVariantIcon, ResetIcon } from "../../asset";
import { SearchIconLightColorVariant } from "../../asset";
import { QueryResultFilterForm } from "../../container/form/queryresultfilter";
import { retrieveAllTableFieldService } from "../../util/query/retrieveAllTableFields";
import { ConnectedTable } from "../../container/form/connectedtable";
import { joinTablesService } from "../../util/query/runJoin";
import { retrieveTableRelationshipService } from "../../util/query/retrieveTableRelationship";
import { retrieveAllTableRelationshipService } from "../../util/query/retrieveAllTableRelationship";
import { AppContext } from "../../context/appContext";
import { QueryResultTable } from "../../container/table/queryresulttable";
import { saveQueryService } from "../../util/savedview/saveQuery";
import { SaveQueryForm } from "../../container/form/savequery";
import { BaseAlertModal } from "../../component/modal/alert";
import confetti from "../../asset/image/success-confetti.png";
import { useNavigate } from "react-router-dom";
import { ResultFilter } from "../../type/container.type";
import { useQuery } from "@tanstack/react-query";
import { retrieveAllUserConnectionService } from "../../util/connection/retrieveAllUserConnection";
import { connectToDBService } from "../../util/connection/connectToDB";
import spinner from "../../asset/icon/spinner-icon.svg";
import errorIcon from "../../asset/icon/error-icon.svg";
import { HashLink } from "react-router-hash-link";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const Connection = () => {
	const connectionHints = [
		"Ensure the Host URL is correct.",
		"Confirm that your username and password are accurate.",
		"Verify that your connection port (5432) is open and accessible.",
		"If you're using a cloud provider (e.g., AWS), check that the database instance is running.",
	];

	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const navigate = useNavigate();
	const matches = useMediaQuery("(min-width:250px)");
	const { joinTableCount, setJoinTableCount, activeConnection } =
		useContext(AppContext);
	const previousActiveConnection = useRef(activeConnection);

	const [isJoining, setIsJoining] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isExporting, setIsExporting] = useState(false);
	const [joiningError, setJoiningError] = useState<string | null>(null);
	const [saveQueryError, setSaveQueryError] = useState<string | null>(null);
	const [exportError, setExportError] = useState<string | null>(null);
	const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
	const [queryResult, setQueryResult] = useState<Record<string, any>[] | null>(
		null
	);
	const [baseQueryResult, setBaseQueryResult] = useState<
		Record<string, any>[] | null
	>(null);
	const [selectedRows, setSelectedRows] = useState<number[]>([]);
	const [isSaveQueryFormModalOpen, setIsSaveQueryFormModalOpen] =
		useState(false);
	const [queryName, setQueryName] = useState<string>("");

	const [isConnectingToDatabase, setIsConnectingToDatabase] = useState(false);
	const [databaseConnectionError, setDatabaseConnectionError] = useState<
		string | null
	>(null);
	const [
		isDatabaseConnectionAlertModalOpen,
		setIsDatabaseConnectionAlertModalOpen,
	] = useState(false);
	const [isDatabaseConnectionSuccessful, setIsDatabaseConnectionSuccessful] =
		useState(false);
	const [
		databaseConnectionAlertModalTexts,
		setDatabaseConnectionAlertModalTexts,
	] = useState<Record<string, any>>({
		header: "Establishing connection..",
		body: "Please wait while we connect to the database. This might take a few seconds",
	});

	const [dataSource] = useState<Record<string, any>>(
		localStorage.getItem("dataSource")
			? JSON.parse(localStorage.getItem("dataSource") as string)
			: { name: "" }
	);
	const [resultFilterFields, setResultFilterFields] = useState<
		{ name: string; type: string }[]
	>([]);
	const [resultFilter, setResultFilter] = useState<ResultFilter>({
		sort: [{ field: "", value: "" }],
		filter: [
			{ field: "", type: "", criteria: "", value: "", start: "", end: "" },
		],
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

	const handleDatabaseConnection = useCallback(
		async (connectionDetails: Record<string, any>) => {
			if (!dataSource.name) {
				return setDatabaseConnectionError(
					"Please select a datasource to proceed."
				);
			}
			setDatabaseConnectionError(null);
			setIsConnectingToDatabase(true);
			setIsDatabaseConnectionAlertModalOpen(true);
			setIsDatabaseConnectionSuccessful(false);
			setDatabaseConnectionAlertModalTexts({
				header: "Establishing connection..",
				body: "Please wait while we connect to the database. This might take a few seconds",
			});
			const messages = [
				{
					header: "Establishing connection..",
					body: "Please wait while we connect to the database. This might take a few seconds",
				},
				{
					header: "Verifying credentials...",
					body: "Fetching your data from the server. Hang tight while we load the necessary information.",
				},
				{
					header: "Retrieving data...",
					body: "Checking your credentials and ensuring a secure connection. Please be patient.",
				},
			];
			let index = 0;
			const interval = setInterval(() => {
				index++;
				if (index < messages.length) {
					setDatabaseConnectionAlertModalTexts(messages[index]);
				}
			}, 2000);
			try {
				const response = await connectToDBService(
					TOKEN,
					connectionDetails,
					dataSource.name
				);
				clearInterval(interval);
				if (response.status === "success") {
					setIsConnectingToDatabase(false);
					setDatabaseConnectionAlertModalTexts({
						header: "Connection Successful!",
						body: "Your database connection has been established successfully.",
					});
					setIsDatabaseConnectionSuccessful(true);
					previousActiveConnection.current = activeConnection;
				} else {
					setIsConnectingToDatabase(false);
					setDatabaseConnectionAlertModalTexts({
						header: "Connection Failed",
						body: "We couldn't connect to your database. Please check the following:",
					});
					setDatabaseConnectionError(
						"Connection failed. Please check your credentials and try again."
					);
				}
			} catch (error: any) {
				clearInterval(interval);
				setIsConnectingToDatabase(false);
				setDatabaseConnectionAlertModalTexts({
					header: "Connection Failed",
					body: "We couldn't connect to your database. Please check the following:",
				});
				setDatabaseConnectionError(`Connection failed. ${error.message}`);
				console.error("Connection failed:", error);
			}
		},
		[
			TOKEN,
			dataSource.name,
			activeConnection,
			setDatabaseConnectionError,
			setIsConnectingToDatabase,
			setIsDatabaseConnectionAlertModalOpen,
			setIsDatabaseConnectionSuccessful,
			setDatabaseConnectionAlertModalTexts,
		]
	);

	useEffect(() => {
		const handleRetrieveAllTable = async () => {
			setDbTables([]);
			setDbTableFields([]);
			setDatasourceDetails({
				primaryTable: " ",
				secondaryTable_0: " ",
				primaryTableFields: [],
				secondaryTable_0_Fields: [],
			});
			if (!dataSource.name) {
				console.error("Please select a datasource to proceed.");
				return;
			}
			if (!activeConnection) return;
			if (previousActiveConnection.current !== activeConnection) {
				await handleDatabaseConnection({
					host: activeConnection.host,
					port: activeConnection.port,
					username: activeConnection.user,
					password: activeConnection.password,
					dbName: activeConnection.dbName,
				});
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
	}, [TOKEN, dataSource.name, activeConnection, handleDatabaseConnection]);

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

	const { data: savedConnections = [] } = useQuery({
		queryKey: ["savedConnections", TOKEN],
		queryFn: async () => {
			const response = await retrieveAllUserConnectionService(TOKEN);
			const uniqueConnections = new Map<string, any>();
			const mapped = response?.map((connection: any, index: number) => ({
				...connection,
				id: index + 1,
			}));
			// just adding here that we can improve this config of course
			// 1. By having an endpoint that returns all pool connections in memory
			// 2. By designing activeConnection in such a way that it can hold an array of active connections,
			// so that in the case one connects to multiple dbs but does not go to the connections page to trigger
			// this query, active connections would hold the multiple connections in memory.
			if (activeConnection) {
				mapped.push({ ...activeConnection });
			}
			mapped.forEach((connection: any) => {
				const key = `${connection.user}-${connection.host}-${connection.dbName}-${connection.dbType}-${connection.port}-${connection.password}`;
				if (!uniqueConnections.has(key)) {
					uniqueConnections.set(key, connection);
				} else if (connection.id === "*") {
					uniqueConnections.set(key, connection);
				}
			});
			return Array.from(uniqueConnections.values());
		},
		enabled: !!TOKEN,
	});

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

	const handleResetResultFilter = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		setResultFilter({
			sort: [{ field: "", value: "" }],
			filter: [
				{ field: "", type: "", criteria: "", value: "", start: "", end: "" },
			],
		});
		await handleJoinTable(e);
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
		setBaseQueryResult(null);
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
				setBaseQueryResult(response.data);
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
				setResultFilterFields(uniqueFields);
				return response.data;
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

	const handleDatabaseConnectionAlertModalPersist = () => {
		if (isConnectingToDatabase) return;
		setIsDatabaseConnectionAlertModalOpen(false);
	};

	const handleNavigateToSavedView = (
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
				resultFilter,
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
					onClick={handleNavigateToSavedView}
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

	const databaseConnectionAlertIcon = (
		<Box
			component={"div"}
			className={`alert-modal-item ${
				databaseConnectionError
					? "alert-modal-icon"
					: isDatabaseConnectionSuccessful
					? "alert-modal-icon alert-modal-confetti-icon"
					: "alert-modal-icon alert-modal-spinning-icon"
			}`}
		>
			<img
				src={
					databaseConnectionError
						? errorIcon
						: isDatabaseConnectionSuccessful
						? confetti
						: spinner
				}
				alt={
					databaseConnectionError
						? "Error Icon"
						: isDatabaseConnectionSuccessful
						? "Success Confetti"
						: "Spinning Loader"
				}
			/>
		</Box>
	);

	const databaseConnectionAlertHeader = (
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
				{databaseConnectionAlertModalTexts.header}
			</Typography>
		</Box>
	);

	const databaseConnectionAlertBody = (
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
					{databaseConnectionAlertModalTexts.body}
				</Typography>
			</Box>
			{isDatabaseConnectionSuccessful && (
				<Box overflow={"hidden"}>
					<BaseButton
						disableElevation
						variant="contained"
						sx={{ width: "100%" }}
						onClick={handleDatabaseConnectionAlertModalPersist}
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
							Continue
						</Typography>
					</BaseButton>
				</Box>
			)}
			{databaseConnectionError && (
				<Box component={"div"} className="connection-hints">
					<ul>
						{connectionHints.map((hint, index) => (
							<li key={index}>{hint}</li>
						))}
					</ul>
				</Box>
			)}
			{databaseConnectionError && (
				<Stack className="complaint-handling">
					<Box>
						<Typography
							variant="subtitle1"
							fontFamily={"Inter"}
							fontWeight={"600"}
							fontSize={14}
							lineHeight={"normal"}
							color={"var(--form-header-color)"}
							whiteSpace={"normal"}
						>
							Having issues?
						</Typography>
					</Box>
					<Box>
						<Typography
							variant="body1"
							fontFamily={"Inter"}
							fontWeight={"500"}
							fontSize={12}
							lineHeight={"normal"}
							color={"var(--subtitle-grey-color)"}
							whiteSpace={"normal"}
						>
							<Typography
								component={"a"}
								fontFamily={"inherit"}
								fontWeight={"inherit"}
								fontSize={"inherit"}
								lineHeight={"inherit"}
								color={"inherit"}
								textTransform={"inherit"}
								sx={{ textDecoration: "underline", cursor: "pointer" }}
							>
								Reach out to support
							</Typography>{" "}
							- we're happy to assist you.
						</Typography>
					</Box>
				</Stack>
			)}
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
				<BaseAlertModal
					open={isDatabaseConnectionAlertModalOpen}
					icon={databaseConnectionAlertIcon}
					header={databaseConnectionAlertHeader}
					body={databaseConnectionAlertBody}
					className="alert-modal"
					handleClose={handleDatabaseConnectionAlertModalPersist}
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
						gap={"calc(var(--flex-gap)/2)"}
						justifyContent={"space-between"}
					>
						<Stack
							direction={"row"}
							overflow={"hidden"}
							alignItems={"center"}
							gap={"calc(var(--flex-gap)/4)"}
						>
							<Box overflow={"hidden"} flexShrink={0}>
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
						<Box overflow={"hidden"} justifyContent={{ tablet: "flex-end" }}>
							<HashLink
								smooth
								style={{ textDecoration: "none" }}
								to={"/dashboard#database-information-form"}
							>
								<BaseButton
									disableElevation
									variant="contained"
									startIcon={<DatabaseLightColorVariantIcon />}
									padding="calc(var(--basic-padding)/2)"
									sx={{
										width: {
											mobile: "100%",
											tablet: "auto",
											laptop: "100%",
											desktop: "auto",
										},
									}}
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
										Connect
									</Typography>
								</BaseButton>
							</HashLink>
						</Box>
					</Stack>
					<form>
						<DatasourceSwitchForm
							tables={dbTables}
							dbList={savedConnections}
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
									bgcolor="var(--shiny-black-color)"
									padding="calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)"
									startIcon={<SearchIconLightColorVariant />}
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
											color={"var(--light-color)"}
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
												isSaving || !queryResult || queryResult.length === 0
											}
											disableElevation
											variant="contained"
											sx={{
												height: "inherit",
												width: "100%",
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
												Save
											</Typography>
										</BaseButton>
									</Box>
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
