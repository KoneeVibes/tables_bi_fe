import { Stack, styled } from "@mui/material";

export const QueryResultWrapper = styled(Stack)(({ theme }) => {
	return {
		overflow: "hidden",
		borderRadius: "16px",
		gap: "calc(var(--flex-gap)/2)",
		border: "1px solid var(--form-label-border-color)",
		"& .query-result-filter-form": {
			flex: 1,
		},
		"& .centered-thumbnail": {
			display: "block",
			marginLeft: "auto",
			marginRight: "auto",
		},
	};
});
