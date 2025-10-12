import { Checkbox, TableBody, TableCell, TableRow } from "@mui/material";
import { BaseTable } from "../../../component/table";
import { QueryResultTablePropsType } from "../../../type/container.type";

export const QueryResultTable: React.FC<QueryResultTablePropsType> = ({
	rows,
	headers,
	selectedRows,
	handleCheckRow,
	handleCheckAllRow,
}) => {
	return (
		<BaseTable
			rows={rows}
			headers={headers}
			containsCheckbox={true}
			selectedRows={selectedRows}
			onSelectAllRowClick={handleCheckAllRow}
		>
			<TableBody>
				{rows?.map((row, index) => {
					return (
						<TableRow key={index}>
							<TableCell>
								<Checkbox
									checked={selectedRows?.indexOf(index) !== -1}
									onChange={(e) => handleCheckRow(e, index)}
									inputProps={{
										"aria-label": "Select row",
									}}
									sx={{
										padding: 0,
										"& .MuiSvgIcon-root": { fill: "inherit" },
									}}
								/>
							</TableCell>
							{headers.map((header, cellIndex) => (
								<TableCell key={cellIndex}>{row[header]}</TableCell>
							))}
						</TableRow>
					);
				})}
			</TableBody>
		</BaseTable>
	);
};
