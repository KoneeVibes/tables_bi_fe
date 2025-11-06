import { Box, Grid, IconButton, Stack, Typography } from "@mui/material";
import { QueryResultFilterFormWrapper } from "./styled";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseSelect } from "../../../component/form/select/styled";
import { QueryResultFilterPropsType } from "../../../type/container.type";
import { BaseOption } from "../../../component/form/option/styled";
import filterIcon from "../../../asset/icon/filter-icon.svg";
import sortIcon from "../../../asset/icon/sort-icon.svg";
import { BaseInput } from "../../../component/form/input/styled";
import { PrimaryColorDeleteIcon } from "../../../asset";
import { BaseButton } from "../../../component/button/styled";
import { useState } from "react";

export const QueryResultFilterForm: React.FC<QueryResultFilterPropsType> = ({
	fields,
	formDetails,
	setFormDetails,
	handleSorting,
	handleFiltering,
}) => {
	const sortBy = ["ascending", "descending"];
	const criteria = [
		"equals",
		"not equals",
		"greater than",
		"less than",
		"contains",
	];

	const [isSortSelectOpen, setIsSortSelectOpen] = useState(false);
	const [isFilterSelectOpen, setIsFilterSelectOpen] = useState(false);

	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
			| React.ChangeEvent<HTMLInputElement>
			| (Event & {
					target: {
						value: unknown;
						name: string;
					};
			  }),
		type: "sort" | "filter",
		index: number
	) => {
		const { name, value } = e.target;
		setFormDetails((prev) => ({
			...prev,
			[type]: prev[type].map((item, i) =>
				i === index ? { ...item, [name]: value } : item
			),
		}));
	};

	const handleRemoveField = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		type: "sort" | "filter",
		index: number
	) => {
		e.stopPropagation();
		setFormDetails((prev) => {
			const items = prev[type];
			if (items.length === 1) {
				return {
					...prev,
					[type]: [
						type === "sort"
							? { field: "", value: "" }
							: { field: "", criteria: "", value: "" },
					],
				};
			}
			return {
				...prev,
				[type]: items.filter((_, i) => i !== index),
			};
		});
	};

	const handleAddField = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		type: "sort" | "filter"
	) => {
		e.stopPropagation();
		setFormDetails((prev) => ({
			...prev,
			[type]: [
				...prev[type],
				type === "sort"
					? { field: "", value: "" }
					: { field: "", criteria: "", value: "" },
			],
		}));
	};

	const handleClearFilters = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		type: "sort" | "filter"
	) => {
		e.stopPropagation();
		setFormDetails((prev) => ({
			...prev,
			[type]: [
				type === "sort"
					? { field: "", value: "" }
					: { field: "", criteria: "", value: "" },
			],
		}));
	};

	const handleOpenFilterSelect = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		e.stopPropagation();
		if (!isFilterSelectOpen) setIsFilterSelectOpen(true);
	};

	const handleCloseFilterSelect = () => {
		setIsFilterSelectOpen(false);
	};

	const handleApplyFilter = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.stopPropagation();
		setIsFilterSelectOpen(false);
		return await handleFiltering(e);
	};

	const handleOpenSortSelect = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		e.stopPropagation();
		if (!isSortSelectOpen) setIsSortSelectOpen(true);
	};

	const handleCloseSortSelect = () => {
		setIsSortSelectOpen(false);
	};

	const handleApplySort = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.stopPropagation();
		setIsSortSelectOpen(false);
		return await handleSorting(e);
	};

	return (
		<QueryResultFilterFormWrapper>
			<Grid container spacing={"calc(var(--flex-gap)/4)"}>
				<Grid size={{ mobile: 12, miniTablet: 6 }}>
					<BaseFieldSet>
						<Stack
							direction={"row"}
							height={"inherit"}
							alignItems={"center"}
							borderRadius={"12px"}
							gap={"calc(var(--flex-gap)/4)"}
							border={"1px solid var(--border-color)"}
						>
							<Box
								display={"flex"}
								height={"inherit"}
								alignItems={"center"}
								justifyContent={"center"}
								borderRadius={"12px 0 0 12px"}
								bgcolor={"var(--stepper-color)"}
								padding={"calc(var(--basic-padding)/4)"}
							>
								<img src={sortIcon} alt="sort-icon" />
							</Box>
							<BaseSelect
								name="sort"
								border="none"
								displayEmpty
								open={isSortSelectOpen}
								onClick={handleOpenSortSelect}
								onClose={handleCloseSortSelect}
								renderValue={() => <em>Sort</em>}
								MenuProps={{
									anchorOrigin: { vertical: "bottom", horizontal: "left" },
									transformOrigin: { vertical: "top", horizontal: "left" },
									PaperProps: {
										sx: {
											display: fields.length === 0 ? "none" : "block",
											minWidth: {
												miniTablet: "317px !important",
											},
											"& .MuiMenu-list": {
												display: "flex",
												flexDirection: "column",
												gap: "calc(var(--flex-gap)/2)",
												padding: "calc(var(--basic-padding)/2)",
												paddingRight: "calc(var(--basic-padding)/2) !important",
												width: {
													mobile: "-webkit-fill-available !important",
													miniTablet: "revert !important",
												},
											},
										},
									},
								}}
							>
								<Box>
									<Typography
										variant="h3"
										fontFamily={"Inter"}
										fontWeight={600}
										fontSize={"14px"}
										lineHeight={"normal"}
										color="var(--form-header-color)"
										whiteSpace={"normal"}
									>
										Sort
									</Typography>
								</Box>
								{formDetails.sort.map((s, index) => {
									return (
										<BaseOption
											key={index}
											sx={{
												padding: "0px",
												"&.Mui-selected, &.Mui-selected:hover, &.Mui-selected.Mui-focusVisible":
													{
														backgroundColor: "var(--light-color)",
													},
											}}
										>
											<Stack
												gap={"calc(var(--flex-gap)/2)"}
												width={"-webkit-fill-available"}
												direction={{ miniTablet: "row" }}
												alignItems={{ miniTablet: "center" }}
											>
												<Box
													flex={1}
													overflow={"hidden"}
													onClick={(e) => e.stopPropagation()}
													onMouseDown={(e) => e.stopPropagation()}
												>
													<BaseSelect
														fullWidth
														name="field"
														displayEmpty
														value={s.field}
														inputProps={{
															renderValue: (selected: string) =>
																!selected?.trim() ? (
																	<em>Select Field</em>
																) : (
																	selected
																),
														}}
														onChange={(e) => handleChange(e, "sort", index)}
														MenuProps={{
															anchorOrigin: {
																vertical: "bottom",
																horizontal: "left",
															},
															transformOrigin: {
																vertical: "top",
																horizontal: "left",
															},
															PaperProps: {
																sx: {
																	display:
																		fields.length === 0 ? "none" : "block",
																	maxHeight: `${48.8 * 3}px !important`, // 3 items * each item height
																	"& .MuiMenu-list": {
																		padding: 0,
																		width: "100%",
																	},
																},
															},
														}}
													>
														{fields?.map((field, index) => {
															return (
																<BaseOption key={index} value={field}>
																	{field}
																</BaseOption>
															);
														})}
													</BaseSelect>
												</Box>
												<Box
													flex={1}
													overflow={"hidden"}
													onClick={(e) => e.stopPropagation()}
													onMouseDown={(e) => e.stopPropagation()}
												>
													<BaseSelect
														fullWidth
														name="value"
														displayEmpty
														value={s.value}
														inputProps={{
															renderValue: (selected: string) =>
																!selected?.trim() ? (
																	<em>Select Option</em>
																) : (
																	selected
																),
														}}
														onChange={(e) => handleChange(e, "sort", index)}
														MenuProps={{
															anchorOrigin: {
																vertical: "bottom",
																horizontal: "left",
															},
															transformOrigin: {
																vertical: "top",
																horizontal: "left",
															},
															PaperProps: {
																sx: {
																	display:
																		fields.length === 0 ? "none" : "block",
																	maxHeight: `${48.8 * 3}px !important`, // 3 items * each item height
																	"& .MuiMenu-list": {
																		padding: 0,
																		width: "100%",
																	},
																},
															},
														}}
													>
														{sortBy?.map((option, index) => {
															return (
																<BaseOption key={index} value={option}>
																	{option}
																</BaseOption>
															);
														})}
													</BaseSelect>
												</Box>
												<Box
													flexShrink={0}
													onClick={(e) => e.stopPropagation()}
													onMouseDown={(e) => e.stopPropagation()}
												>
													<IconButton
														sx={{ padding: 0 }}
														onClick={(e) =>
															handleRemoveField?.(e, "sort", index)
														}
													>
														<PrimaryColorDeleteIcon />
													</IconButton>
												</Box>
											</Stack>
										</BaseOption>
									);
								})}
								<Stack
									gap={"calc(var(--flex-gap)/2)"}
									justifyContent={"space-between"}
									direction={{ miniTablet: "row" }}
								>
									<Box
										flex={1}
										overflow={"hidden"}
										onClick={(e) => e.stopPropagation()}
										onMouseDown={(e) => e.stopPropagation()}
									>
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
											onClick={(e) => handleAddField?.(e, "sort")}
											sx={{ width: { mobile: "100%", miniTablet: "auto" } }}
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
												Add a Field
											</Typography>
										</BaseButton>
									</Box>
									<Stack
										flex={1}
										overflow={"hidden"}
										gap={{
											mobile: "calc(var(--flex-gap)/2)",
											miniTablet: "calc(var(--flex-gap)/4)",
										}}
										direction={{ miniTablet: "row" }}
									>
										<Box
											flex={1}
											overflow={"hidden"}
											onClick={(e) => e.stopPropagation()}
											onMouseDown={(e) => e.stopPropagation()}
										>
											<BaseButton
												variant="outlined"
												disableElevation
												sx={{ width: "100%", height: "100%" }}
												onClick={(e) => handleClearFilters?.(e, "sort")}
												padding="calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)"
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
													Clear Filters
												</Typography>
											</BaseButton>
										</Box>
										<Box
											flex={1}
											overflow={"hidden"}
											onClick={(e) => e.stopPropagation()}
											onMouseDown={(e) => e.stopPropagation()}
										>
											<BaseButton
												variant="contained"
												disableElevation
												onClick={handleApplySort}
												sx={{ width: "100%", height: "100%" }}
												padding="calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)"
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
													Apply Filter
												</Typography>
											</BaseButton>
										</Box>
									</Stack>
								</Stack>
							</BaseSelect>
						</Stack>
					</BaseFieldSet>
				</Grid>
				<Grid size={{ mobile: 12, miniTablet: 6 }}>
					<BaseFieldSet>
						<Stack
							direction={"row"}
							height={"inherit"}
							alignItems={"center"}
							borderRadius={"12px"}
							gap={"calc(var(--flex-gap)/4)"}
							border={"1px solid var(--border-color)"}
						>
							<Box
								display={"flex"}
								height={"inherit"}
								alignItems={"center"}
								justifyContent={"center"}
								borderRadius={"12px 0 0 12px"}
								bgcolor={"var(--stepper-color)"}
								padding={"calc(var(--basic-padding)/4)"}
							>
								<img src={filterIcon} alt="filter-icon" />
							</Box>
							<BaseSelect
								name="filter"
								border="none"
								displayEmpty
								open={isFilterSelectOpen}
								onClick={handleOpenFilterSelect}
								onClose={handleCloseFilterSelect}
								renderValue={() => <em>Filter</em>}
								MenuProps={{
									anchorOrigin: { vertical: "bottom", horizontal: "left" },
									transformOrigin: { vertical: "top", horizontal: "left" },
									PaperProps: {
										sx: {
											display: fields.length === 0 ? "none" : "block",
											minWidth: {
												miniTablet: "250px !important",
											},
											"& .MuiMenu-list": {
												display: "flex",
												flexDirection: "column",
												gap: "calc(var(--flex-gap)/2)",
												padding: "calc(var(--basic-padding)/2)",
												paddingRight: "calc(var(--basic-padding)/2) !important",
												width: {
													mobile: "-webkit-fill-available !important",
													miniTablet: "revert !important",
												},
											},
										},
									},
								}}
							>
								<Box>
									<Typography
										variant="h3"
										fontFamily={"Inter"}
										fontWeight={600}
										fontSize={"14px"}
										lineHeight={"normal"}
										color="var(--form-header-color)"
										whiteSpace={"normal"}
									>
										Filters
									</Typography>
								</Box>
								{formDetails.filter.map((f, index) => {
									return (
										<BaseOption
											key={index}
											sx={{
												padding: "0px",
												"&.Mui-selected, &.Mui-selected:hover, &.Mui-selected.Mui-focusVisible":
													{
														backgroundColor: "var(--light-color)",
													},
											}}
										>
											<Stack
												gap={"calc(var(--flex-gap)/2)"}
												width={"-webkit-fill-available"}
												direction={{ miniTablet: "row" }}
												alignItems={{ miniTablet: "center" }}
											>
												<Box
													flex={1}
													overflow={"hidden"}
													onClick={(e) => e.stopPropagation()}
													onMouseDown={(e) => e.stopPropagation()}
												>
													<BaseSelect
														fullWidth
														name="field"
														displayEmpty
														value={f.field}
														inputProps={{
															renderValue: (selected: string) =>
																!selected?.trim() ? (
																	<em>Select Field</em>
																) : (
																	selected
																),
														}}
														onChange={(e) => handleChange(e, "filter", index)}
														MenuProps={{
															anchorOrigin: {
																vertical: "bottom",
																horizontal: "left",
															},
															transformOrigin: {
																vertical: "top",
																horizontal: "left",
															},
															PaperProps: {
																sx: {
																	display:
																		fields.length === 0 ? "none" : "block",
																	maxHeight: `${48.8 * 3}px !important`, // 3 items * each item height
																	"& .MuiMenu-list": {
																		padding: 0,
																		width: "100%",
																	},
																},
															},
														}}
													>
														{fields?.map((field, index) => {
															return (
																<BaseOption key={index} value={field}>
																	{field}
																</BaseOption>
															);
														})}
													</BaseSelect>
												</Box>
												<Box
													flex={1}
													overflow={"hidden"}
													onClick={(e) => e.stopPropagation()}
													onMouseDown={(e) => e.stopPropagation()}
												>
													<BaseSelect
														fullWidth
														name="criteria"
														displayEmpty
														value={f.criteria}
														inputProps={{
															renderValue: (selected: string) =>
																!selected?.trim() ? (
																	<em>Select Criteria</em>
																) : (
																	selected
																),
														}}
														onChange={(e) => handleChange(e, "filter", index)}
														MenuProps={{
															anchorOrigin: {
																vertical: "bottom",
																horizontal: "left",
															},
															transformOrigin: {
																vertical: "top",
																horizontal: "left",
															},
															PaperProps: {
																sx: {
																	display:
																		fields.length === 0 ? "none" : "block",
																	maxHeight: `${48.8 * 3}px !important`, // 3 items * each item height
																	"& .MuiMenu-list": {
																		padding: 0,
																		width: "100%",
																	},
																},
															},
														}}
													>
														{criteria?.map((c, index) => {
															return (
																<BaseOption key={index} value={c}>
																	{c
																		.split(" ")
																		.map((word) =>
																			word
																				? word.charAt(0).toUpperCase() +
																				  word.slice(1)
																				: word
																		)
																		.join(" ")}
																</BaseOption>
															);
														})}
													</BaseSelect>
												</Box>
												<Box
													flex={1}
													overflow={"hidden"}
													onClick={(e) => e.stopPropagation()}
													onMouseDown={(e) => e.stopPropagation()}
												>
													<BaseInput
														fullWidth
														name="value"
														value={f.value}
														placeholder="Value"
														onChange={(e) => handleChange(e, "filter", index)}
														sx={{
															"&.Mui-focused": {
																border: "1px solid var(--primary-color)",
															},
														}}
													/>
												</Box>
												<Box
													flexShrink={0}
													onClick={(e) => e.stopPropagation()}
													onMouseDown={(e) => e.stopPropagation()}
												>
													<IconButton
														sx={{ padding: 0 }}
														onClick={(e) =>
															handleRemoveField?.(e, "filter", index)
														}
													>
														<PrimaryColorDeleteIcon />
													</IconButton>
												</Box>
											</Stack>
										</BaseOption>
									);
								})}
								<Stack
									gap={"calc(var(--flex-gap)/2)"}
									justifyContent={"space-between"}
									direction={{ miniTablet: "row" }}
								>
									<Box
										flex={1}
										overflow={"hidden"}
										onClick={(e) => e.stopPropagation()}
										onMouseDown={(e) => e.stopPropagation()}
									>
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
											onClick={(e) => handleAddField?.(e, "filter")}
											sx={{ width: { mobile: "100%", miniTablet: "auto" } }}
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
												Add a Field
											</Typography>
										</BaseButton>
									</Box>
									<Stack
										flex={1}
										overflow={"hidden"}
										gap={{
											mobile: "calc(var(--flex-gap)/2)",
											miniTablet: "calc(var(--flex-gap)/4)",
										}}
										direction={{ miniTablet: "row" }}
									>
										<Box
											flex={1}
											overflow={"hidden"}
											onClick={(e) => e.stopPropagation()}
											onMouseDown={(e) => e.stopPropagation()}
										>
											<BaseButton
												variant="outlined"
												disableElevation
												sx={{ width: "100%", height: "100%" }}
												onClick={(e) => handleClearFilters?.(e, "filter")}
												padding="calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)"
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
													Clear Filters
												</Typography>
											</BaseButton>
										</Box>
										<Box
											flex={1}
											overflow={"hidden"}
											onClick={(e) => e.stopPropagation()}
											onMouseDown={(e) => e.stopPropagation()}
										>
											<BaseButton
												variant="contained"
												disableElevation
												onClick={handleApplyFilter}
												sx={{ width: "100%", height: "100%" }}
												padding="calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)"
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
													Apply Filter
												</Typography>
											</BaseButton>
										</Box>
									</Stack>
								</Stack>
							</BaseSelect>
						</Stack>
					</BaseFieldSet>
				</Grid>
			</Grid>
		</QueryResultFilterFormWrapper>
	);
};
