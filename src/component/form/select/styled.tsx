import { Select, styled } from "@mui/material";
import { BaseInputPropsType } from "../../../type/component.type";

export const BaseSelect = styled(Select)<BaseInputPropsType>(
	({ colour, bgcolor, fontweight, fontsize, border, padding, radius }) => {
		return {
			fontFamily: "Inter",
			fontWeight: fontweight || 400,
			fontSize: fontsize || "14px",
			lineHeight: "normal",
			border: border || "1px solid var(--border-color)",
			borderRadius: radius || "12px",
			color: colour || "var(--form-input-color)",
			backgroundColor: bgcolor || "transparent",
			padding: padding || "calc(var(--basic-padding)/2)",
			outline: "none",
			"& .MuiInputBase-input": {
				textOverflow: "ellipsis",
				padding: 0,
			},
			"& fieldset": {
				border: "none",
			},
		};
	}
);
