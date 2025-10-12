import {
	Checkbox,
	Paper,
	Table,
	TableCell,
	TableHead,
	TableRow,
} from "@mui/material";
import { TableWrapper } from "./styled";
import { BaseTablePropsType } from "../../type/component.type";

export const BaseTable: React.FC<BaseTablePropsType> = ({
	rows,
	headers,
	children,
	selectedRows,
	onSelectAllRowClick,
	containsCheckbox = false,
}) => {
	return (
		<TableWrapper component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						{containsCheckbox && (
							<TableCell>
								<Checkbox
									indeterminate={
										selectedRows &&
										selectedRows?.length > 0 &&
										selectedRows?.length < rows?.length
									}
									checked={
										rows?.length > 0 && selectedRows?.length === rows?.length
									}
									onChange={onSelectAllRowClick}
									inputProps={{
										"aria-label": "Select all rows",
									}}
									sx={{
										padding: 0,
										"& .MuiSvgIcon-root": { fill: "inherit" },
									}}
								/>
							</TableCell>
						)}
						{headers?.map((header, index) => {
							return <TableCell key={index}>{header}</TableCell>;
						})}
					</TableRow>
				</TableHead>
				{children}
			</Table>
		</TableWrapper>
	);
};
