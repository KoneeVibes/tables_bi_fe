import { Stack, styled } from "@mui/material";

export const SavedViewWrapper = styled(Stack)(({ theme }) => {
	return {
		gap: "calc(var(--flex-gap))",
		overflow: "hidden",
		"& .header": {
			gap: "calc(var(--flex-gap)/2)",
			justifyContent: "space-between",
			width: "-webkit-fill-available",
			flexDirection: "column-reverse",
			"& .tabs": {
				width: "auto",
				flexDirection: "row",
				borderRadius: "12px",
				padding: "calc(var(--basic-padding)/4)",
				backgroundColor: "var(--menu-item-hover-bg-color)",
				"& .tab-item": {
					cursor: "pointer",
					overflow: "hidden",
					borderRadius: "8px",
					padding: "calc(var(--basic-padding)/4)",
					"&.active-tab-item": {
						backgroundColor: "var(--light-color)",
					},
				},
			},
		},
		"& .query-stack": {
			maxWidth: "43.75rem",
			width: "-webkit-fill-available",
			gap: "calc(var(--flex-gap))",
			"& .grouped-results": {
				gap: "calc(var(--flex-gap)/2)",
				"& .query-result": {
					borderRadius: "10px",
					boxSizing: "border-box",
					padding: "calc(var(--basic-padding)/2)",
					gap: "calc(var(--flex-gap))",
					border: "1px solid var(--form-label-border-color)",
					flexDirection: "row",
					alignItems: "center",
					justifyContent: "space-between",
					overflow: "hidden",
					"& .result-title": {
						flexDirection: "row",
						alignItems: "center",
						gap: "calc(var(--flex-gap)/2)",
						overflow: "hidden",
						"& .result-meta-data": {
							flexDirection: "row",
							gap: "calc(var(--flex-gap)/2)",
						},
					},
				},
			},
		},
		[theme.breakpoints.up(300)]: {
			"& .header": {
				"& .tabs": {
					width: "fit-content",
				},
			},
		},
		[theme.breakpoints.up("laptop")]: {
			alignItems: "center",
			"& .header": {
				flexDirection: "row",
			},
		},
	};
});
