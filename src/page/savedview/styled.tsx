import { Stack, styled } from "@mui/material";

export const SavedViewWrapper = styled(Stack)(({ theme }) => {
	return {
		gap: "calc(var(--flex-gap))",
		overflow: "hidden",
		"& .header": {
			gap: "calc(var(--flex-gap)/2)",
			justifyContent: "space-between",
			width: "-webkit-fill-available",
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
			position: "relative",
			paddingBottom: "calc(var(--basic-padding) * 2)",
			"& .grouped-results": {
				gap: "calc(var(--flex-gap)/2)",
				"& .query-result": {
					borderRadius: "10px",
					boxSizing: "border-box",
					padding: "calc(var(--basic-padding)/2)",
					gap: "calc(var(--flex-gap))",
					border: "1px solid var(--form-label-border-color)",
					flexDirection: "row",
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
					"& .dropdown-modal": {
						position: "absolute",
						right: "calc(var(--basic-padding) * 2)",
						backgroundColor: "var(--light-color)",
						boxShadow: "0px 0px 10px 0px #0000001A",
						zIndex: 1,
						borderRadius: "10px",
						paddingTop: 0,
						paddingBottom: 0,
						overflow: "hidden",
						"& .MuiListItem-root": {
							padding: 0,
							"& .MuiListItemButton-root": {
								padding:
									"calc(var(--basic-padding)/4) calc(var(--basic-padding)*0.375)",
								gap: "calc(var(--flex-gap)/4)",
								"& .MuiListItemText-root": {
									margin: 0,
									"& .MuiTypography-root": {
										fontFamily: "Inter",
										fontSize: "14px",
									},
								},
								"& .MuiListItemIcon-root": {
									minWidth: 0,
								},
							},
							"&:hover": {
								backgroundColor: "var(--diluted-primary-color)",
							},
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
