import { Stack, styled } from "@mui/material";

export const EmailVerificationFormWrapper = styled(Stack)(() => {
	return {
		gap: "var(--flex-gap)",
		"& legend": {
			textAlign: "left",
		},
		"& fieldset": {
			display: "flex",
			flexDirection: "column",
			overflow: "hidden",
			"& .MuiInputBase-input": {
				textAlign: "center",
			},
		},
	};
});
