import { MenuItem, styled } from "@mui/material";
import { BaseTypographyType } from "../../../type/component.type";

export const BaseOption = styled(MenuItem)<BaseTypographyType>(({ colour, fontweight, fontsize }) => {
    return {
        fontFamily: "Inter",
        fontWeight: fontweight || 400,
        fontSize: fontsize || "14px",
        lineHeight: "normal",
        color: colour || "var(--form-input-color)",
        padding: "calc(var(--basic-padding)/2)",
    }
})
