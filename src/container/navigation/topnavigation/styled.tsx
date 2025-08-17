import { AppBar, styled } from "@mui/material";

export const TopNavigationWrapper = styled(AppBar)(({ theme }) => {
	return {
		backgroundColor: "inherit",
		boxShadow: "none",
		overflow: "hidden",
		"& .MuiToolbar-root": {
			minHeight: "var(--top-nav-height)",
			backgroundColor: "inherit",
			borderRadius: "inherit",
			borderBottom: "1px solid var(--form-label-border-color)",
			padding: "calc(var(--basic-padding)/2) var(--basic-padding)",
			gap: "var(--flex-gap)",
			justifyContent: "space-between",
		},
		"& .top-navigation-LHS": {
			flex: 1,
			overflow: "hidden",
		},
		"& .top-navigation-MS": {
			display: "none",
			overflow: "hidden",
			flexDirection: "row",
			alignItems: "center",
			gap: "calc(var(--flex-gap)/2)",
			"& .logged-in-user-information-stack": {
				flexDirection: "row",
				gap: "calc(var(--flex-gap)/2)",
				"& .user-avatar-box": {
					display: "flex",
					"& .user-avatar": {
						height: "40px",
						width: "40px",
						objectFit: "fill",
						cursor: "pointer",
						borderRadius: "50%",
					},
				},
				"& .username-and-email-stack": {
					"& .username-area": {
						overflow: "hidden",
					},
					"& .useremail-area": {
						flexDirection: "row",
						alignItems: "center",
						gap: "calc(var(--flex-gap)/2)",
						overflow: "hidden",
						"& .clipboard-icon-box": {
							display: "flex",
							"& .clipboard-icon": {
								cursor: "pointer",
							},
						},
					},
				},
			},
		},
		"& .top-navigation-RHS": {
			display: "flex",
			justifyContent: "center",
			overflow: "hidden",
		},
		[theme.breakpoints.up("tablet")]: {
			width: "auto",
			position: "fixed",
			top: 0,
			right: 0,
			left: "var(--side-nav-width)",
			"& .top-navigation-MS": {
				display: "flex",
			},
			"& .top-navigation-RHS": {
				display: "none",
			},
		},
	};
});
