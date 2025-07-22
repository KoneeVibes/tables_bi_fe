import { styled } from "@mui/material";

export const SignInWrapper = styled("form")(() => {
    return {
        display: "flex",
        flexDirection: "column",
        gap: "var(--flex-gap)",
        margin: "calc(var(--basic-margin) * 2) var(--basic-margin)",
        "& .logo-box": {
            alignItems: "center",
            justifyContent: "center",
        },
        "& fieldset": {
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
        },
    }
})
