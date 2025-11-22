import { useContext, useState } from "react";
import { Box, Checkbox, Grid, Stack, Typography } from "@mui/material";
import { ConnectedTableFormWrapper } from "./styled";
import { BaseLabel } from "../../../component/form/label/styled";
import { BaseSelect } from "../../../component/form/select/styled";
import { BaseOption } from "../../../component/form/option/styled";
import { ConnectedTablePropsType } from "../../../type/container.type";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { AppContext } from "../../../context/appContext";
import { BaseButton } from "../../../component/button/styled";

export const ConnectedTable: React.FC<ConnectedTablePropsType> = ({
	fields,
	tables,
	tableName,
	fieldName,
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

	const { setJoinTableCount } = useContext(AppContext);

	const [isOpen, setIsOpen] = useState(false);

	const uniqueTables = Array.from(
		new Set(tables.flatMap((item) => [item.source_table, item.target_table]))
	);

	const handleChange = (
		e:
			| React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
			| (Event & {
					target: {
						value: unknown;
						name: string;
					};
			  })
	) => {
		const { name, value } = e.target as { name: string; value: any };

		// Handle field (multi-select)
		if (Array.isArray(value)) {
			// Handle "Select All"
			if (value.includes("*")) {
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
			// Handle normal field selection
			return setFormDetails((prev) => {
				const prevFields = prev[name] || [];
				const updated = value.map((v: string) => {
					const existing = prevFields.find((f: any) => f.name === v);
					return existing || { name: v, aggregate: "" };
				});
				return {
					...prev,
					[name]: updated,
				};
			});
		}
		// Handle table selection (string value)
		setFormDetails((prev) => {
			const updated: Record<string, any> = {
				...prev,
				[name]: value,
				...(name === tableName && { [fieldName]: [] }),
			};
			if (name.startsWith("secondaryTable_")) {
				const currentIndex = Number(name.split("_")[1]);
				Object.keys(prev).forEach((key) => {
					if (key.startsWith("secondaryTable_")) {
						const idx = Number(key.split("_")[1]);
						if (idx > currentIndex) {
							delete updated[key];
							delete updated[`${key}_Fields`];
						}
					}
				});
				setJoinTableCount(currentIndex);
			}
			return updated;
		});
	};

	const handleAggregateChange = (
		fieldName: string,
		columnName: string,
		selectedAggregate: string
	) => {
		setFormDetails((prev) => ({
			...prev,
			[fieldName]:
				prev[fieldName].map((f: any) =>
					f.name === columnName ? { ...f, aggregate: selectedAggregate } : f
				) || [],
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
		<ConnectedTableFormWrapper>
			<Grid container spacing={"calc(var(--flex-gap)/2)"}>
				<Grid size={{ mobile: 12 }}>
					<BaseFieldSet>
						<BaseLabel>Tables</BaseLabel>
						<BaseSelect
							name={tableName}
							value={
								typeof formDetails[tableName] === "string"
									? formDetails[tableName]
									: " "
							}
							onChange={handleChange}
						>
							<BaseOption value=" ">No Table Selected</BaseOption>
							{uniqueTables.map((table, index) => (
								<BaseOption key={index} value={table}>
									{table}
								</BaseOption>
							))}
						</BaseSelect>
					</BaseFieldSet>
				</Grid>
				<Grid size={{ mobile: 12 }}>
					<BaseFieldSet>
						<BaseLabel>Select Fields</BaseLabel>
						<BaseSelect
							multiple
							name={fieldName}
							displayEmpty
							value={
								(formDetails[fieldName] ?? []).map((f: any) => f.name) ?? []
							}
							onChange={handleChange}
							open={isOpen}
							onClick={handleOpenSelect}
							onClose={handleCloseSelect}
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
										maxHeight: `${105.725 * 2 + 56}px !important`, // 3 items * each item height
										"& .MuiMenu-list": {
											padding: 0,
											width: "100%",
										},
									},
								},
							}}
						>
							<BaseOption value="*" sx={{ gap: "calc(var(--flex-gap)/2)" }}>
								<Box>
									<Checkbox
										checked={
											(formDetails[fieldName] ?? [])?.length === fields.length
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
							{fields.map((field, index) => (
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
											checked={(formDetails[fieldName] ?? [])?.some(
												(f: Record<string, any>) => f.name === field.column_name
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
											display={
												(formDetails[fieldName] ?? [])?.some(
													(f: Record<string, any>) =>
														f.name === field.column_name
												)
													? "flex"
													: "none"
											}
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
														!(formDetails[fieldName] ?? []).some(
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
														(formDetails[fieldName] ?? []).find(
															(f: any) => f.name === field.column_name
														)?.aggregate || ""
													}
													onChange={(e) =>
														handleAggregateChange(
															fieldName,
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
							))}
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
		</ConnectedTableFormWrapper>
	);
};
