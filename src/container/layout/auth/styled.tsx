import { Stack, styled } from "@mui/material";

export const AuthLayoutWrapper = styled(Stack)(({ theme }) => {
    return {
        flexDirection: "row",
        backgroundColor: "transparent",
        overflow: "hidden",
        height: "100vh",
        "& .image-box": {
            flex: 1,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            "& .image-box-inner": {
                width: "100%",
                overflow: "hidden",
                borderRadius: "30px",
                gap: "calc(var(--flex-gap) * 1.5)",
                margin: "var(--basic-margin)",
                padding: "var(--basic-padding)",
                backgroundColor: "var(--shiny-black-color)",
                "& .auth-thumbnail>img": {
                    width: "100%",
                    height: "auto",
                    maxHeight: "250px",
                    objectFit: "cover",
                },
            },
            [theme.breakpoints.down("laptop")]: {
                display: "none",
            }
        },
        "& .form-box": {
            flex: 1,
            overflow: "auto",
        },
    }
});
