import { Box, Checkbox, Grid, Stack, Typography } from "@mui/material";
import { SelectDbTableFieldFormWrapper } from "./styled";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseLabel } from "../../../component/form/label/styled";
import { BaseSelect } from "../../../component/form/select/styled";
import { BaseOption } from "../../../component/form/option/styled";
import { SelectedDbTableFieldsPropsType } from "../../../type/container.type";
import { BaseButton } from "../../../component/button/styled";
import { useState } from "react";

export const SelectDbTableField: React.FC<SelectedDbTableFieldsPropsType> = ({
	fields,
	formDetails,
	setFormDetails,
}) => {
	const aggregates = {
		integer: ["SUM", "AVG", "MIN", "MAX", "COUNT"],
		bigint: ["SUM", "AVG", "MIN", "MAX", "COUNT"],
		numeric: ["SUM", "AVG", "MIN", "MAX", "COUNT"],
		double: ["SUM", "AVG", "MIN", "MAX", "COUNT"],
		real: ["SUM", "AVG", "MIN", "MAX", "COUNT"],
		smallint: ["SUM", "AVG", "MIN", "MAX", "COUNT"],
		"timestamp without time zone": ["MIN", "MAX", "COUNT"],
		"timestamp with time zone": ["MIN", "MAX", "COUNT"],
		date: ["MIN", "MAX", "COUNT"],
		time: ["MIN", "MAX", "COUNT"],
		"character varying": ["COUNT"],
		text: ["COUNT"],
		boolean: ["COUNT"],
		json: ["COUNT"],
		jsonb: ["COUNT"],
		default: ["COUNT"],
	};

	const [isOpen, setIsOpen] = useState(false);

	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
			| React.ChangeEvent<HTMLInputElement>
			| (Event & {
					target: {
						value: unknown;
						name: string;
					};
			  })
	) => {
		const { name, value } = e.target;
		if (Array.isArray(value) && value.includes("*")) {
			if (formDetails[name]?.length === fields.length) {
				return setFormDetails((prev) => ({
					...prev,
					[name]: [],
				}));
			}
			return setFormDetails((prev) => ({
				...prev,
				[name]: fields.map((field) => {
					const existing = prev[name]?.find(
						(f: any) => f.name === field.column_name
					);
					return {
						name: field.column_name,
						aggregate: existing?.aggregate || "",
					};
				}),
			}));
		}
		setFormDetails((prev) => {
			const prevFields = prev[name] || [];
			const updated = Array.isArray(value)
				? value.map((v) => {
						const existing = prevFields.find((f: any) => f.name === v);
						return existing || { name: v, aggregate: "" };
				  })
				: [];
			return {
				...prev,
				[name]: updated,
			};
		});
	};

	const handleAggregateChange = (
		fieldName: string,
		selectedAggregate: string
	) => {
		setFormDetails((prev) => ({
			...prev,
			primaryTableFields: prev.primaryTableFields.map((f: any) =>
				f.name === fieldName ? { ...f, aggregate: selectedAggregate } : f
			),
		}));
	};

	const handleOpenSelect = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>
	) => {
		e.stopPropagation();
		if (!isOpen) setIsOpen(true);
	};

	const handleCloseSelect = () => {
		setIsOpen(false);
	};

	return (
		<SelectDbTableFieldFormWrapper>
			<Grid container spacing={"var(--flex-gap)"}>
				<Grid size={{ mobile: 12 }}>
					<BaseFieldSet>
						<BaseLabel>Select Fields</BaseLabel>
						<BaseSelect
							multiple
							displayEmpty
							name="primaryTableFields"
							onChange={(e) => handleChange(e)}
							open={isOpen}
							onClick={handleOpenSelect}
							onClose={handleCloseSelect}
							value={formDetails.primaryTableFields.map((f: any) => f.name)}
							inputProps={{
								renderValue: (selected: string[]) =>
									selected?.length === 0 ? (
										<em>Select Field</em>
									) : (
										selected?.join(", ")
									),
							}}
							MenuProps={{
								anchorOrigin: { vertical: "bottom", horizontal: "left" },
								transformOrigin: { vertical: "top", horizontal: "left" },
								PaperProps: {
									sx: {
										display: fields.length === 0 ? "none" : "block",
										minWidth: {
											tablet: "400px !important",
										},
										maxHeight: `${105.725 * 3 + 56}px !important`, // 3 items * each item height
										"& .MuiMenu-list": {
											padding: 0,
											width: "100%",
										},
									},
								},
							}}
						>
							<BaseOption value="*" sx={{ gap: "calc(var(--flex-gap)/4)" }}>
								<Box>
									<Checkbox
										checked={
											formDetails.primaryTableFields?.length === fields.length
										}
										sx={{
											padding: 0,
											"& .MuiSvgIcon-root": { fill: "inherit" },
										}}
									/>
								</Box>
								<Box>
									<Typography
										component={"span"}
										fontFamily={"inherit"}
										fontWeight={"inherit"}
										fontSize={"inherit"}
										lineHeight={"normal"}
										color={"inherit"}
										whiteSpace={"normal"}
									>
										Select All Fields
									</Typography>
								</Box>
							</BaseOption>
							{fields.map((field, index) => {
								return (
									<BaseOption
										key={index}
										value={field.column_name}
										sx={{
											alignItems: "flex-start",
											gap: "calc(var(--flex-gap)/2)",
											"&.Mui-selected": {
												backgroundColor: "transparent",
											},
										}}
									>
										<Box>
											<Checkbox
												checked={formDetails.primaryTableFields?.some(
													(f: Record<string, any>) =>
														f.name === field.column_name
												)}
												sx={{
													padding: 0,
													"& .MuiSvgIcon-root": { fill: "inherit" },
												}}
											/>
										</Box>
										<Stack
											flex={1}
											overflow={"hidden"}
											gap={"calc(var(--flex-gap)/2)"}
										>
											<Stack
												direction={"row"}
												alignItems={"center"}
												gap={"calc(var(--flex-gap)/4)"}
											>
												<Box overflow={"hidden"}>
													<Typography
														variant={"subtitle1"}
														fontFamily={"inherit"}
														fontWeight={"inherit"}
														fontSize={"inherit"}
														lineHeight={"normal"}
														color={"inherit"}
														whiteSpace={"nowrap"}
													>
														{field.column_name}
													</Typography>
												</Box>
												{field?.data_type && (
													<Box
														overflow={"hidden"}
														borderRadius={"5px"}
														bgcolor={"var(--stepper-color)"}
														padding={"calc(var(--basic-padding)/8)"}
													>
														<Typography
															variant="subtitle2"
															fontFamily={"inherit"}
															fontWeight={"inherit"}
															fontSize={"10px"}
															lineHeight={"normal"}
															color={"var(--primary-color)"}
															whiteSpace={"nowrap"}
														>
															{field.data_type}
														</Typography>
													</Box>
												)}
											</Stack>
											<Stack
												direction={"row"}
												alignItems={"center"}
												gap={"calc(var(--flex-gap)/2)"}
											>
												<Box>
													<Typography
														component={"span"}
														fontFamily={"inherit"}
														fontWeight={"inherit"}
														fontSize={"12px"}
														lineHeight={"normal"}
														color={"var(--subtitle-grey-color)"}
														whiteSpace={"normal"}
													>
														Aggregate
													</Typography>
												</Box>
												<Box
													flex={1}
													onClick={(e) => e.stopPropagation()}
													onMouseDown={(e) => e.stopPropagation()}
												>
													<BaseSelect
														displayEmpty
														radius="10px"
														sx={{ width: { mobile: "50%" } }}
														padding="calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)"
														disabled={
															!formDetails.primaryTableFields.some(
																(f: any) => f.name === field.column_name
															)
														}
														inputProps={{
															renderValue: (selected: string) => {
																if (!selected?.trim()) {
																	return <em>No Aggregate</em>;
																}
																return selected;
															},
														}}
														value={
															formDetails.primaryTableFields.find(
																(f: any) => f.name === field.column_name
															)?.aggregate || ""
														}
														onChange={(e) =>
															handleAggregateChange(
																field.column_name,
																e.target.value as string
															)
														}
													>
														{field?.data_type &&
															(
																aggregates[
																	field.data_type as keyof typeof aggregates
																] || aggregates.default
															).map((aggregate: string, index: number) => (
																<BaseOption key={index} value={aggregate}>
																	<Typography
																		component="span"
																		fontFamily="inherit"
																		fontWeight="inherit"
																		fontSize="inherit"
																		lineHeight="normal"
																		color="inherit"
																		whiteSpace="nowrap"
																	>
																		{aggregate}
																	</Typography>
																</BaseOption>
															))}
													</BaseSelect>
												</Box>
											</Stack>
										</Stack>
									</BaseOption>
								);
							})}
							<Box
								display={"flex"}
								overflow={"hidden"}
								padding="calc(var(--basic-padding)/2)"
								justifyContent={{ tablet: "flex-end" }}
							>
								<BaseButton
									disableElevation
									variant="contained"
									sx={{
										width: {
											mobile: "100%",
											tablet: "auto",
											laptop: "100%",
											desktop: "auto",
										},
									}}
									onClick={handleCloseSelect}
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
										Done
									</Typography>
								</BaseButton>
							</Box>
						</BaseSelect>
					</BaseFieldSet>
				</Grid>
			</Grid>
		</SelectDbTableFieldFormWrapper>
	);
};
