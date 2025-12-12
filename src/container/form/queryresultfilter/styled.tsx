import { Stack, styled } from "@mui/material";

export const QueryResultFilterFormWrapper = styled(Stack)(({ theme }) => {
	return {
		gap: "var(--flex-gap)",
		"& fieldset": {
			flex: 1,
			display: "flex",
			flexDirection: "column",
			overflow: "hidden",
			"& .MuiSelect-root": {
				padding: 0,
				width: "100%",
			},
		},
		"& em": {
			fontFamily: "Inter",
			fontWeight: 400,
			fontSize: "14px",
			fontStyle: "normal",
			lineHeight: "normal",
			color: "var(--form-input-color)",
		},
	};
});
