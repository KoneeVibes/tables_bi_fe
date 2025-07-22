import { Stack, styled } from "@mui/material";

export const SignUpFormWrapper = styled(Stack)(() => {
    return {
        gap: "var(--flex-gap)",
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
