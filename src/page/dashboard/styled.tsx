import { Stack, styled } from "@mui/material";
import checkedIcon from "../../asset/icon/input-custom-checker.svg";

export const DashboardWrapper = styled(Stack)(({ theme }) => {
	return {
		gap: "calc(var(--flex-gap))",
		overflow: "hidden",
		"& .db-type-selection": {
			borderRadius: "10px",
			maxWidth: "43.75rem",
			boxSizing: "border-box",
			padding: "var(--basic-padding)",
			gap: "calc(var(--flex-gap))",
			border: "1px solid var(--form-label-border-color)",
		},
		"& .feature-item": {
			gap: "calc(var(--flex-gap) / 2)",
		},
		"& .datasource-form": {
			overflow: "hidden",
			"& .datasource-fieldset": {
				cursor: "pointer",
				borderRadius: "10px",
				padding: "calc(var(--basic-padding)/2)",
				width: "-webkit-fill-available",
				display: "flex",
				flexDirection: "column",
				border: "1px solid var(--form-label-border-color)",
				"& label": {
					flex: 1,
					display: "flex",
					marginBlock: "0",
					cursor: "pointer",
					overflow: "hidden",
					flexDirection: "column",
					justifyContent: "space-between",
					gap: "calc(var(--flex-gap) / 2)",
				},
				"& .MuiInputBase-input": {
					width: "inherit",
					height: "inherit",
					cursor: "pointer",
					appearance: "none",
					borderRadius: "50%",
					"&:checked": {
						backgroundImage: `url(${checkedIcon})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					},
				},
				"& .datasource-icon": {
					width: "100%",
					height: "auto",
				},
			},
		},
		"& #database-information-form": {
			borderRadius: "10px",
			maxWidth: "43.75rem",
			boxSizing: "border-box",
			padding: "var(--basic-padding)",
			gap: "calc(var(--flex-gap))",
			border: "1px solid var(--form-label-border-color)",
			display: "flex",
			flexDirection: "column",
		},
		"& .complaint-box": {
			width: "100%",
			maxWidth: "43.75rem",
			borderRadius: "10px",
			"& .complaint-box-content": {
				borderRadius: "10px",
				gap: "calc(var(--flex-gap)/2)",
				padding: "var(--basic-padding)",
				backgroundColor: "var(--stepper-color)",
			},
		},
		[theme.breakpoints.up("miniTablet")]: {
			"& .datasource-form": {
				"& .datasource-fieldset": {
					"& .datasource-icon": {
						width: "auto",
					},
				},
			},
		},
		[theme.breakpoints.up("laptop")]: {
			alignItems: "center",
			padding: "var(--basic-padding)",
			"& .feature-item": {
				alignItems: "center",
				flexDirection: "row",
			},
			"& .datasource-form": {
				padding: "var(--basic-padding) calc(var(--basic-padding) * 2) 0",
			},
			"& .complaint-box": {
				"& .complaint-box-content": {
					width: "fit-content",
				},
			},
		},
	};
});
