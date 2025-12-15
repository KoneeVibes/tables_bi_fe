import { Container, styled } from "@mui/material";

export const AppLayoutWrapper = styled(Container)(() => {
	return {
		padding: 0,
		width: "auto",
		overflow: "hidden",
		backgroundColor: "var(--light-color)",
	};
});
