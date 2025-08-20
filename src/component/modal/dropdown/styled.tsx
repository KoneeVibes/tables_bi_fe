import { Dialog, styled } from "@mui/material";

export const BaseDropDownModalWrapper = styled(Dialog)(() => {
	return {
		"& .MuiDialog-paper": {
			"& ul": {
				listStyleType: "none",
				paddingInline: 0,
				marginBlock: 0,
				padding: "calc(var(--basic-padding)/4)",
			},
			"& li": {
				borderRadius: "10px",
				gap: "calc(var(--flex-gap)/2)",
				"& .menu-icon-box": {
					display: "flex",
				},
				"&:hover": {
					backgroundColor: "var(--menu-item-hover-bg-color)",
				},
			},
		},
	};
});
