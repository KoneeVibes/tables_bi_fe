import { styled, TableContainer, TableContainerProps } from "@mui/material";

export const TableWrapper = styled(TableContainer)<TableContainerProps>(() => {
	return {
		boxShadow: "none",
		"& .MuiTableCell-root": {
			fontFamily: "Inter",
			fontWeight: 500,
			fontSize: "14px",
			color: "var(--table-cell-text-color)",
			overflow: "hidden",
			whiteSpace: "normal",
			textOverflow: "ellipsis",
			maxWidth: "10rem",
			padding: "calc(var(--basic-padding)/4)",
			borderBottom: "1px solid var(--table-row-border-color)",
		},
		"& .MuiTableHead-root": {
			backgroundColor: "var(--diluted-primary-color)",
			"& .MuiTableCell-root": {
				color: "var(--form-header-color)",
			},
		},
		"& .MuiTableBody-root": {
			"& .MuiTableCell-root": {
				fontWeight: 400,
			},
			"& .MuiTableRow-root:last-child": {
				"& .MuiTableCell-root": {
					borderBottom: "none",
				},
			},
		},
	};
});
