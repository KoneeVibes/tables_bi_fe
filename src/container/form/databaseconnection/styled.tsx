import { Stack, styled } from "@mui/material";

export const DatabaseConnectionFormWrapper = styled(Stack)(() => {
	return {
		gap: "var(--flex-gap)",
		"& legend": {
			textAlign: "left",
		},
		"& fieldset": {
			display: "flex",
			flexDirection: "column",
			overflow: "hidden",
		},
	};
});
