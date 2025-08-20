import { Dialog, styled } from "@mui/material";

export const BaseAlertModalWrapper = styled(Dialog)(() => {
	return {
		"& .MuiDialog-paper": {
			width: "400px",
			display: "flex",
			borderRadius: "12px",
			flexDirection: "column",
			gap: "calc(var(--flex-gap)  / 2)",
			"& .alert-modal-content": {
				gap: "calc(var(--flex-gap)  / 2)",
			},
		},
	};
});
