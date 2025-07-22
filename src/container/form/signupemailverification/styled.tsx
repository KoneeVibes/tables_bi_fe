import { Stack, styled } from "@mui/material";

export const SignUpEmailVerificationFormWrapper = styled(Stack)(() => {
    return {
        gap: "var(--flex-gap)",
        "& fieldset": {
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            "& .MuiInputBase-input": {
                textAlign: "center",
            },
        },
    }
})
