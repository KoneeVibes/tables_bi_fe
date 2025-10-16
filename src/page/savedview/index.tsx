import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "../../container/layout/app";
import { SavedViewWrapper } from "./styled";
import { retrieveAllSavedQueryService } from "../../util/savedview/retrieveAllSavedQuery";
import Cookies from "universal-cookie";
import {
	Box,
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

export const SavedView = () => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const navigate = useNavigate();
	const matches = useMediaQuery("(min-width:280px)");
	const dropdownRef = useRef<HTMLUListElement | null>(null);

	const [activeTabIndex, setActiveTabIndex] = useState(0);
	const [isQueryMenuOpen, setIsQueryMenuOpen] = useState(false);
	const [selectedQueryIndex, setSelectedQueryIndex] = useState<number | null>(
		null
	);

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
			return groupedByDate;
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
		index: number
	) => {
		e.preventDefault();
		setSelectedQueryIndex(index);
		return setIsQueryMenuOpen(true);
	};

	const handleCloseQueryMenu = () => {
		setSelectedQueryIndex(null);
		return setIsQueryMenuOpen(false);
	};

	const handleMenuItemClick = (
		e: React.MouseEvent<HTMLLIElement, MouseEvent>,
		item: Record<string, any>,
		index: number
	) => {
		e.preventDefault();
		switch (item.id) {
			case 0:
				navigate(`${item.url}/${index}` as string);
				break;
			default:
				handleCloseQueryMenu();
				break;
		}
	};

	const handleDropDownClickOutside = (event: MouseEvent) => {
		if (
			dropdownRef.current &&
			!dropdownRef.current.contains(event.target as Node)
		)
			return setSelectedQueryIndex(null);
	};

	useEffect(() => {
		// ensure that the empty string value of initial state is matched
		if (selectedQueryIndex !== null) {
			document.addEventListener("mousedown", handleDropDownClickOutside);
		} else {
			document.removeEventListener("mousedown", handleDropDownClickOutside);
		}
		return () => {
			document.removeEventListener("mousedown", handleDropDownClickOutside);
		};
	}, [selectedQueryIndex]);

	return (
		<AppLayout pageId="Saved-View" pageTitle="Saved View">
			<SavedViewWrapper>
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
						<Box
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
						</Box>
					</Stack>
					<Stack className="action-items">
						<Box overflow={"hidden"}>
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
						</Box>
					</Stack>
				</Stack>
				<Stack className="query-stack">
					{activeTabIndex === 0 &&
						savedQuery &&
						Object.entries(savedQuery as Record<string, any>).map(
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
																	handleOpenQueryMenu(e, query?.originalIndex)
																}
															>
																<VerticalEllipsisIcon />
															</IconButton>
														</Box>
														{isQueryMenuOpen &&
															selectedQueryIndex === query?.originalIndex && (
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
