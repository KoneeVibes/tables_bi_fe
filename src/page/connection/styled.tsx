import { Stack, styled } from "@mui/material";

export const ConnectionWrapper = styled(Stack)(({ theme }) => {
	return {
		gap: "calc(var(--flex-gap))",
		overflow: "hidden",
		"& .data-source-stack": {
			flex: 0.3,
			overflow: "hidden",
			borderRadius: "16px",
			height: "fit-content",
			gap: "calc(var(--flex-gap)/1.2)",
			padding: "calc(var(--basic-padding)/2)",
			border: "1px solid var(--form-label-border-color)",
		},
		"& .query-builder-and-result-stack": {
			flex: 0.7,
			overflow: "hidden",
			gap: "calc(var(--flex-gap)/2)",
			"& .query-builder-stack": {
				borderRadius: "16px",
				gap: "calc(var(--flex-gap))",
				padding: "calc(var(--basic-padding)/2)",
				border: "1px solid var(--form-label-border-color)",
				"& .connected-tables-area": {
					gap: "calc(var(--flex-gap)/2)",
					"& .main-area": {
						borderRadius: "12px",
						padding: "calc(var(--basic-padding))",
						border: "1px solid var(--form-label-border-color)",
						"&.reduce-padding": {
							padding: "calc(var(--basic-padding)/2)",
						},
						"& .connected-table": {
							display: "flex",
							flexDirection: "column",
							gap: "calc(var(--flex-gap)/2)",
						},
					},
				},
			},
			"& .centered-thumbnail": {
				display: "block",
				marginLeft: "auto",
				marginRight: "auto",
			},
			"& .result-stack": {
				overflow: "hidden",
				borderRadius: "16px",
				gap: "calc(var(--flex-gap)/2)",
				border: "1px solid var(--form-label-border-color)",
				"& .query-result-filter-form": {
					flex: 1,
					overflow: "hidden",
				},
				"& .query-result-call-to-action": {
					flex: 1,
					width: "100%",
					overflow: "hidden",
					flexDirection: "row",
					gap: "calc(var(--flex-gap)/4)",
				},
			},
		},
		[theme.breakpoints.up("laptop")]: {
			flexDirection: "row",
		},
	};
});
