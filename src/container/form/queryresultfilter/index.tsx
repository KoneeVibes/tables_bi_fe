import { Box, Grid, Stack } from "@mui/material";
import { QueryResultFilterFormWrapper } from "./styled";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseSelect } from "../../../component/form/select/styled";
import { BaseFormPropsType } from "../../../type/container.type";
import { BaseOption } from "../../../component/form/option/styled";
import groupIcon from "../../../asset/icon/group-icon.svg";
import filterIcon from "../../../asset/icon/filter-icon.svg";
import sortIcon from "../../../asset/icon/sort-icon.svg";

export const QueryResultFilterForm: React.FC<BaseFormPropsType> = ({
	formDetails,
	setFormDetails,
}) => {
	const sortBy = ["ascending", "descending"];
	const groupBy = ["category", "status"];
	const filters = ["active", "inactive", "all"];

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
		setFormDetails((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<QueryResultFilterFormWrapper>
			<Grid container spacing={"calc(var(--flex-gap)/4)"}>
				<Grid size={{ mobile: 12, miniTablet: 4 }}>
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
								<img src={groupIcon} alt="group-icon" />
							</Box>
							<BaseSelect
								name="group"
								border="none"
								value={formDetails.group}
								onChange={(e) => handleChange(e)}
							>
								{groupBy.map((option, index) => {
									return (
										<BaseOption key={index} value={option}>
											{option}
										</BaseOption>
									);
								})}
							</BaseSelect>
						</Stack>
					</BaseFieldSet>
				</Grid>
				<Grid size={{ mobile: 12, miniTablet: 4 }}>
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
								value={formDetails.sort}
								onChange={(e) => handleChange(e)}
							>
								{sortBy.map((option, index) => {
									return (
										<BaseOption key={index} value={option}>
											{option}
										</BaseOption>
									);
								})}
							</BaseSelect>
						</Stack>
					</BaseFieldSet>
				</Grid>
				<Grid size={{ mobile: 12, miniTablet: 4 }}>
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
								value={formDetails.filter}
								onChange={(e) => handleChange(e)}
							>
								{filters.map((option, index) => {
									return (
										<BaseOption key={index} value={option}>
											{option}
										</BaseOption>
									);
								})}
							</BaseSelect>
						</Stack>
					</BaseFieldSet>
				</Grid>
			</Grid>
		</QueryResultFilterFormWrapper>
	);
};
