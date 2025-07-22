import { styled } from "@mui/material";

export const SignUpWrapper = styled("form")(() => {
    return {
        display: "flex",
        flexDirection: "column",
        gap: "var(--flex-gap)",
        margin: "calc(var(--basic-margin) * 2) var(--basic-margin)",
    }
})