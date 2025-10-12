import { Grid } from "@mui/material";
import { DatasourceSwitchTablePropsType } from "../../../type/container.type";
import { DatasourceSwitchFormWrapper } from "./styled";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseLabel } from "../../../component/form/label/styled";
import { BaseSelect } from "../../../component/form/select/styled";
import { BaseOption } from "../../../component/form/option/styled";
import { useContext } from "react";
import { AppContext } from "../../../context/appContext";

export const DatasourceSwitchForm: React.FC<DatasourceSwitchTablePropsType> = ({
	tables,
	formDetails,
	setFormDetails,
}) => {
	const initialFormDetails = {
		primaryTable: " ",
		secondaryTable_0: " ",
		primaryTableFields: [],
		secondaryTable_0_Fields: [],
	};
	const initialJoinTableCount = 0;

	const { setJoinTableCount } = useContext(AppContext);

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
		setFormDetails({
			...initialFormDetails,
			[name]: value,
		});
		return setJoinTableCount(initialJoinTableCount);
	};

	return (
		<DatasourceSwitchFormWrapper>
			<Grid container spacing={"var(--flex-gap)"}>
				<Grid size={{ mobile: 12 }}>
					<BaseFieldSet>
						<BaseLabel>Tables</BaseLabel>
						<BaseSelect
							name="primaryTable"
							value={formDetails.primaryTable}
							onChange={(e) => handleChange(e)}
						>
							<BaseOption value=" ">No Table Selected</BaseOption>
							{tables?.map((table, index) => {
								return (
									<BaseOption key={index} value={table.table_name}>
										{table.table_name}
									</BaseOption>
								);
							})}
						</BaseSelect>
					</BaseFieldSet>
				</Grid>
			</Grid>
		</DatasourceSwitchFormWrapper>
	);
};
