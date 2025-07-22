import { FormLabel, styled } from "@mui/material";
import { BaseLabelPropsType } from "../../../type/component.type";

export const BaseLabel = styled(FormLabel)<BaseLabelPropsType>(({ colour, fontsize, fontweight }) => {
    return {
        fontFamily: "Inter",
        fontWeight: fontweight || 500,
        fontSize: fontsize || "14px",
        lineHeight: "normal",
        color: colour || "var(--form-label-color)",
        marginBlock: "calc(var(--basic-margin)/4)",
        overflow: "hidden",
        marginBlockStart: 0,
        textOverflow: "ellipsis",
    }
})
