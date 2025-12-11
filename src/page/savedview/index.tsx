import { useEffect, useRef, useState, useCallback } from "react";
import { HashLink } from "react-router-hash-link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppLayout } from "../../container/layout/app";
import { SavedViewWrapper } from "./styled";
import { retrieveAllSavedQueryService } from "../../util/savedview/retrieveAllSavedQuery";
import Cookies from "universal-cookie";
import {
	Box,
	CircularProgress,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import savedQueryIcon from "../../asset/icon/saved-query-icon.svg";
import { VerticalEllipsisIcon } from "../../asset";
import { BaseButton } from "../../component/button/styled";
import { queryMenuItems } from "../../config/static";
import { deleteSavedQueryService } from "../../util/savedview/deleteSavedQuery";
import { BaseAlertModal } from "../../component/modal/alert";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { joinTablesService } from "../../util/query/runJoin";

export const SavedView = () => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const matches = useMediaQuery("(min-width:280px)");
	const dropdownRef = useRef<HTMLUListElement | null>(null);

	const [isDeleting, setIsDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [activeTabIndex, setActiveTabIndex] = useState(0);
	const [isQueryMenuOpen, setIsQueryMenuOpen] = useState(false);
	const [exportError, setExportError] = useState<string | null>(null);
	const [queryResult, setQueryResult] = useState<Record<string, any>[] | null>(
		null
	);
	const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
	const [selectedQuery, setSelectedQuery] = useState<Record<
		string,
		any
	> | null>(null);

	const { data: savedQuery } = useQuery({
		queryKey: ["savedQuery", TOKEN],
		queryFn: async () => {
			const response = await retrieveAllSavedQueryService(TOKEN);
			const groupedByDate = response.reduce(
				(
					acc: Record<string, any>,
					item: Record<string, any>,
					index: number
				) => {
					const dateKey = new Date(
						item.queryDetails.createdAt
					).toLocaleDateString("en-US", {
						// weekday: "long",
						year: "numeric",
						month: "long",
						day: "2-digit",
					});
					if (!acc[dateKey]) {
						acc[dateKey] = [];
					}
					acc[dateKey].push({ ...item, originalIndex: index });
					return acc;
				},
				{} as Record<string, typeof response>
			);
			return {
				grouped: groupedByDate,
				flat: response,
			};
		},
		enabled: !!TOKEN,
	});

	const handleToggleActiveTab = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		index: number
	) => {
		e.preventDefault();
		if (index === activeTabIndex) return;
		return setActiveTabIndex(index);
	};

	const handleOpenQueryMenu = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		id: string,
		index: number
	) => {
		e.preventDefault();
		setSelectedQuery({ index, id });
		return setIsQueryMenuOpen(true);
	};

	const handleCloseQueryMenu = () => {
		setSelectedQuery(null);
		return setIsQueryMenuOpen(false);
	};

	const handleAlertModalPersist = () => {
		if (isDeleting) return;
		setSelectedQuery(null);
		setIsConfirmationModalOpen(false);
	};

	const deleteSavedQuery = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		queryId: string
	) => {
		e.preventDefault();
		if (!queryId) return;
		setIsDeleting(true);
		try {
			const response = await deleteSavedQueryService(TOKEN, queryId);
			if (response.status === "success") {
				setIsDeleting(false);
				setSelectedQuery(null);
				setIsConfirmationModalOpen(false);
				queryClient.invalidateQueries({
					queryKey: ["savedQuery", TOKEN],
				});
			} else {
				setIsDeleting(false);
				setDeleteError("Deletion failed. Please try again.");
			}
		} catch (error: any) {
			setIsDeleting(false);
			setDeleteError(`Deletion failed. ${error.message}`);
			console.error("Deletion failed:", error);
		}
	};

	const joinTables = async () => {
		try {
			setQueryResult(null);
			const connectionConfig =
				savedQuery?.flat?.[Number(selectedQuery?.index)]?.connectionConfig;
			if (!connectionConfig) return;
			const payload = {
				connectionConfig,
				datasourceDetails:
					savedQuery?.flat?.[Number(selectedQuery?.index)]?.datasourceDetails,
				tableRelationship:
					savedQuery?.flat?.[Number(selectedQuery?.index)]?.tableRelationships,
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
				return response.data;
			} else {
				console.error(
					"Join tables failed. Please check your credentials and try again."
				);
			}
		} catch (error: any) {
			console.error("Join tables failed:", error);
		}
	};

	const handleExportQuery = async (
		e: React.MouseEvent,
		dataOverride?: any[]
	) => {
		e.preventDefault();
		setExportError(null);

		const exportData = dataOverride || queryResult;
		if (!exportData || exportData.length <= 0) {
			setExportError("No query result available to export.");
			return;
		}
		try {
			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet("Query Table");

			const columns = Object.keys(exportData[0]).map((key) => ({
				header: key,
				key,
				width: 20,
			}));

			worksheet.columns = columns;
			worksheet.addRows(exportData);
			worksheet.getRow(1).font = { bold: true };
			worksheet.getRow(1).alignment = { horizontal: "center" };

			const buffer = await workbook.xlsx.writeBuffer();
			const blob = new Blob([buffer], {
				type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			});
			saveAs(blob, `TablesBI - Query Table.xlsx`);
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "An unexpected error occurred";
			setExportError(`Query export failed. ${errorMessage}`);
			console.error("Query export failed:", error);
		}
	};

	const handleMenuItemClick = async (
		e: React.MouseEvent<HTMLLIElement, MouseEvent>,
		item: Record<string, any>,
		index: number
	) => {
		e.preventDefault();
		switch (item.id) {
			case 0:
				navigate(`${item.url}/${index}` as string);
				break;
			case 1:
				const joinedData = await joinTables();
				if (joinedData) {
					await handleExportQuery(e, joinedData);
				}
				break;
			case 2:
				setDeleteError(null);
				setIsConfirmationModalOpen(true);
				break;
			default:
				handleCloseQueryMenu();
				break;
		}
	};

	const handleDropDownClickOutside = useCallback(
		(event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!isConfirmationModalOpen &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				return setSelectedQuery(null);
			}
		},
		[isConfirmationModalOpen]
	);

	useEffect(() => {
		// ensure that the empty string value of initial state is matched
		if (selectedQuery !== null) {
			document.addEventListener("mousedown", handleDropDownClickOutside);
		} else {
			document.removeEventListener("mousedown", handleDropDownClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleDropDownClickOutside);
		};
	}, [selectedQuery, handleDropDownClickOutside]);

	const alertHeader = (
		<Box
			component={"div"}
			className="alert-modal-item alert-modal-header confirmation-modal-header"
		>
			<Typography
				variant="h3"
				fontFamily={"Inter"}
				fontWeight={600}
				fontSize={"18px"}
				lineHeight={"normal"}
				color="var(--form-header-color)"
				textAlign={"left"}
				whiteSpace={"normal"}
			>
				Delete Table?
			</Typography>
		</Box>
	);

	const alertBody = (
		<Stack className="alert-modal-item alert-modal-body confirmation-modal-body">
			<Stack gap={"calc(var(--flex-gap)/4)"}>
				<Box>
					<Typography
						variant="h3"
						fontFamily={"Inter"}
						fontWeight={500}
						fontSize={"18px"}
						lineHeight={"normal"}
						color="var(--form-header-color)"
						textAlign={"center"}
						whiteSpace={"normal"}
					>
						Are you sure you want to delete this table?
					</Typography>
				</Box>
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
						This table will be permanently removed from your library and cannot
						be recovered.
					</Typography>
				</Box>
			</Stack>
			{deleteError && (
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
						{deleteError}
					</Typography>
				</Box>
			)}
			{exportError && (
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
			)}
			<Stack gap={"calc(var(--flex-gap)/2)"} direction={{ mobile: "row" }}>
				<Box flex={1} overflow={"hidden"}>
					<BaseButton
						disableElevation
						variant="outlined"
						sx={{ width: "100%" }}
						onClick={handleAlertModalPersist}
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
							Cancel
						</Typography>
					</BaseButton>
				</Box>
				<Box flex={1} overflow={"hidden"}>
					<BaseButton
						disableElevation
						variant="contained"
						disabled={isDeleting}
						sx={{ width: "100%" }}
						bgcolor="var(--form-field-error-border-color)"
						onClick={(e) => deleteSavedQuery(e, selectedQuery?.id as string)}
					>
						{isDeleting && (
							<CircularProgress color="inherit" className="loader" />
						)}
						<Typography
							variant={"button"}
							fontFamily={"inherit"}
							fontWeight={"inherit"}
							fontSize={"inherit"}
							lineHeight={"inherit"}
							color={"inherit"}
							textTransform={"inherit"}
							visibility={isDeleting ? "hidden" : "visible"}
						>
							Yes, Delete
						</Typography>
					</BaseButton>
				</Box>
			</Stack>
		</Stack>
	);

	return (
		<AppLayout pageId="Saved-View" pageTitle="Saved View">
			<SavedViewWrapper>
				<BaseAlertModal
					open={isConfirmationModalOpen}
					header={alertHeader}
					body={alertBody}
					className="alert-modal delete-confirmation-modal"
					handleClose={handleAlertModalPersist}
				/>
				<Stack className="header">
					<Stack className="tabs">
						<Box
							component={"div"}
							className={`tab-item  ${
								activeTabIndex === 0 ? "active-tab-item" : ""
							}`}
							onClick={(e) => handleToggleActiveTab(e, 0)}
						>
							<Typography
								variant="subtitle1"
								fontFamily={"Inter"}
								fontWeight={500}
								fontSize={"14px"}
								lineHeight={"normal"}
								color="var(--tab-item-text-color)"
							>
								All Tables
							</Typography>
						</Box>
						{/* <Box
							component={"div"}
							className={`tab-item ${
								activeTabIndex === 1 ? "active-tab-item" : ""
							}`}
							onClick={(e) => handleToggleActiveTab(e, 1)}
						>
							<Typography
								variant="subtitle1"
								fontFamily={"Inter"}
								fontWeight={500}
								fontSize={"14px"}
								lineHeight={"normal"}
								color="var(--tab-item-text-color)"
							>
								Recently Deleted
							</Typography>
						</Box> */}
					</Stack>
					<Stack className="action-items">
						<Box overflow={"hidden"}>
							<HashLink
								smooth
								style={{ textDecoration: "none" }}
								to={"/dashboard#database-information-form"}
							>
								<BaseButton
									variant="contained"
									disableElevation
									sx={{ width: matches ? "auto" : "100%" }}
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
										Add New Connection
									</Typography>
								</BaseButton>
							</HashLink>
						</Box>
					</Stack>
				</Stack>
				<Stack className="query-stack">
					{activeTabIndex === 0 &&
						savedQuery?.grouped &&
						Object.entries(savedQuery?.grouped as Record<string, any>).map(
							([key, results], resultIndex) => {
								const resultArray = Array.isArray(results)
									? results
									: [results];
								return (
									<Stack key={resultIndex} className="grouped-results">
										<Box>
											<Typography
												variant="h2"
												fontFamily={"Inter"}
												fontWeight={500}
												fontSize={"20px"}
												lineHeight={"normal"}
												color="var(--form-header-color)"
												whiteSpace={"normal"}
											>
												{key}
											</Typography>
										</Box>
										{resultArray.map(
											(query: Record<string, any>, queryIndex: number) => {
												return (
													<Stack key={queryIndex} className="query-result">
														<Stack className="result-title">
															<Box
																flexShrink={matches ? 0 : 1}
																display={"flex"}
																overflow={"hidden"}
															>
																<img
																	src={savedQueryIcon}
																	alt="saved-query-icon"
																/>
															</Box>
															<Stack
																overflow={"hidden"}
																gap={"calc(var(--flex-gap)/8)"}
															>
																<Box>
																	<Typography
																		variant="h3"
																		fontFamily={"Inter"}
																		fontWeight={600}
																		fontSize={"16px"}
																		lineHeight={"normal"}
																		color="var(--form-header-color)"
																		whiteSpace={"normal"}
																		sx={{ cursor: "pointer" }}
																		onClick={() =>
																			navigate(
																				`/saved-view/${query?.originalIndex}`
																			)
																		}
																	>
																		{query?.queryDetails?.name}
																	</Typography>
																</Box>
																<Stack className="result-meta-data">
																	<Box overflow={"hidden"}>
																		<Typography
																			variant="subtitle1"
																			fontFamily="Inter"
																			fontWeight={500}
																			fontSize="12px"
																			lineHeight="normal"
																			color="var(--subtitle-grey-color)"
																		>
																			{`${Object.entries(
																				query?.datasourceDetails || {}
																			).reduce((count, [key, value]) => {
																				if (
																					Array.isArray(value) &&
																					key.endsWith("Fields")
																				) {
																					return count + value.length;
																				}
																				return count;
																			}, 0)} Fields`}
																		</Typography>
																	</Box>
																	<Box overflow={"hidden"}>
																		<Typography
																			variant="subtitle1"
																			fontFamily={"Inter"}
																			fontWeight={500}
																			fontSize={"12px"}
																			lineHeight={"normal"}
																			color="var(--subtitle-grey-color)"
																		>
																			{` Filters`}
																		</Typography>
																	</Box>
																</Stack>
															</Stack>
														</Stack>
														<Box
															overflow={"hidden"}
															flexShrink={matches ? 0 : 1}
														>
															<IconButton
																sx={{
																	borderRadius: "10px",
																	border: "1px solid var(--border-color)",
																}}
																onClick={(e) =>
																	handleOpenQueryMenu(
																		e,
																		query?.connectionConfig.id,
																		query?.originalIndex
																	)
																}
															>
																<VerticalEllipsisIcon />
															</IconButton>
														</Box>
														{isQueryMenuOpen &&
															selectedQuery?.index === query?.originalIndex && (
																<List
																	component={"ul"}
																	ref={dropdownRef}
																	className="dropdown-modal"
																>
																	{queryMenuItems.map((item, index) => (
																		<ListItem
																			key={index}
																			onClick={(e) =>
																				handleMenuItemClick(
																					e,
																					item,
																					query?.originalIndex
																				)
																			}
																		>
																			<ListItemButton>
																				<ListItemIcon>{item.icon}</ListItemIcon>
																				<ListItemText primary={item.title} />
																			</ListItemButton>
																		</ListItem>
																	))}
																</List>
															)}
													</Stack>
												);
											}
										)}
									</Stack>
								);
							}
						)}
				</Stack>
			</SavedViewWrapper>
		</AppLayout>
	);
};
