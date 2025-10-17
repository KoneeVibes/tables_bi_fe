import { Stack, styled } from "@mui/material";

export const SaveQueryFormWrapper = styled(Stack)(({ theme }) => {
	return {
		gap: "var(--flex-gap)",
		padding: "0 var(--basic-padding) var(--basic-padding)",
		overflow: "hidden",
		"& fieldset": {
			display: "flex",
			flexDirection: "column",
			overflow: "hidden",
		},
	};
});
