import { Dialog, styled } from "@mui/material";

export const BaseFormModalWrapper = styled(Dialog)(() => {
	return {
		"& .MuiDialogContent-root": {
			padding: 0,
		},
		"& .MuiDialogTitle-root": {
			fontFamily: "Inter",
			fontWeight: 600,
			fontSize: 20,
			lineHeight: "normal",
			overflow: "hidden",
			whiteSpace: "nowrap",
			textOverflow: "ellipsis",
			padding: 0,
		},
		"& .title-bar": {
			overflow: "hidden",
			flexDirection: "row",
			alignItems: "center",
			gap: "calc(var(--flex-gap)/2)",
			justifyContent: "space-between",
			padding: "calc(var(--basic-padding))",
		},
	};
});
