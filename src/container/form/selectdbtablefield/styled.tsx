import { Stack, styled } from "@mui/material";

export const SelectDbTableFieldFormWrapper = styled(Stack)(() => {
	return {
		gap: "var(--flex-gap)",
		"& fieldset": {
			display: "flex",
			flexDirection: "column",
			overflow: "hidden",
		},
		"& em": {
			fontFamily: "Inter",
			fontWeight: 400,
			fontSize: "14px",
			fontStyle: "normal",
			lineHeight: "normal",
			color: "var(--form-input-color)",
		},
		"& .field-data-type-box": {
			backgroundColor: "var(--stepper-color)",
		},
	};
});
