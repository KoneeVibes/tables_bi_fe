import { Box, styled } from "@mui/material";

export const MainAreaWrapper = styled(Box)(({ theme }) => {
	return {
		overflow: "hidden",
		minHeight: "100vh",
		left: 0,
		right: 0,
		position: "absolute",
		backgroundColor: "inherit",
		padding: "var(--basic-padding)",
		top: "var(--side-navigation-header-height)",
		[theme.breakpoints.up("tablet")]: {
			left: "var(--side-nav-width)",
		},
	};
});
