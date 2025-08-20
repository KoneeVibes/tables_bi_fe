import { Box, Grid, Typography } from "@mui/material";
import { BaseFormPropsType } from "../../../type/container.type";
import { UpdatePurposeFormWrapper } from "./styled";
import { BaseLegend } from "../../../component/form/legend/styled";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseLabel } from "../../../component/form/label/styled";
import { BaseInput } from "../../../component/form/input/styled";

export const UpdatePurposeForm: React.FC<BaseFormPropsType> = ({
	formDetails,
	setFormDetails,
}) => {
	const intents = [
		"Explore and analyze my business data",
		"Create dashboards without writing SQL",
		"Share insights with my team",
		"Understand trends using filters and aggregations",
		"Track performance over time",
		"Generate quick exports for reporting",
	];

	const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormDetails((prev) => ({
			...prev,
			[name]: prev[name].includes(value)
				? prev[name].filter((v: string) => v !== value)
				: [...prev[name], value],
		}));
	};

	return (
		<UpdatePurposeFormWrapper>
			<Box>
				<BaseLegend>What are you looking to do with TablesBI?</BaseLegend>
				<Typography
					variant="body1"
					fontFamily={"Inter"}
					fontWeight={400}
					fontSize={"14px"}
					lineHeight={"normal"}
					color="var(--dark-color)"
					whiteSpace={"normal"}
					textAlign={"center"}
					marginBlockStart={"calc(var(--basic-margin)/4)"}
				>
					Select all that apply
				</Typography>
			</Box>
			<Grid
				container
				justifyContent={"space-between"}
				spacing={{
					mobile: "calc(var(--flex-gap)/2)",
					laptop: "var(--flex-gap)",
				}}
			>
				{intents.map((intent, index) => {
					return (
						<Grid key={index} flexGrow={1} size={{ mobile: 12 }}>
							<BaseFieldSet>
								<BaseLabel
									sx={{
										display: "flex",
										gap: "calc(var(--flex-gap)/4)",
										alignItems: "center",
										justifyContent: "space-between",
										marginBlock: "0",
										padding: "calc(var(--basic-padding)/2)",
										border: "1px solid var(--form-label-border-color)",
										borderRadius: "10px",
										overflow: "hidden",
										cursor: "pointer",
										"&:hover": {
											border: "1px solid var(--primary-color)",
										},
									}}
								>
									<Typography
										component={"span"}
										variant="subtitle1"
										fontFamily={"inherit"}
										fontWeight={"inherit"}
										fontSize={"inherit"}
										lineHeight={"normal"}
										color={"var(--dark-color)"}
										flex={1}
									>
										{intent}
									</Typography>
									<BaseInput
										type="checkbox"
										name={"purpose"}
										inputProps={{
											checked: formDetails["purpose"].includes(intent),
										}}
										onChange={handleCheckboxChange}
										value={intent}
										sx={{
											padding: 0,
											border: "none",
											borderRadius: "unset",
										}}
									/>
								</BaseLabel>
							</BaseFieldSet>
						</Grid>
					);
				})}
			</Grid>
		</UpdatePurposeFormWrapper>
	);
};
