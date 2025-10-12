import { Stack, styled } from "@mui/material";

export const DatasourceSwitchFormWrapper = styled(Stack)(() => {
	return {
		gap: "var(--flex-gap)",
		"& fieldset": {
			display: "flex",
			flexDirection: "column",
			overflow: "hidden",
		},
	};
});
