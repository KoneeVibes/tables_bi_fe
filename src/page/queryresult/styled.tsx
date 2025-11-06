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
		"& .query-result-call-to-action": {
			overflow: "hidden",
			flexDirection: "row",
			gap: "calc(var(--flex-gap)/4)",
		},
		"& .centered-thumbnail": {
			display: "block",
			marginLeft: "auto",
			marginRight: "auto",
		},
	};
});
