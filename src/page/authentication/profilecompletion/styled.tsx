import { styled } from "@mui/material";

export const ProfileCompletionWrapper = styled("form")(() => {
    return {
        display: "flex",
        flexDirection: "column",
        gap: "var(--flex-gap)",
        margin: "calc(var(--basic-margin) * 2) var(--basic-margin)",
        "& .stepper": {
            gap: "calc(var(--flex-gap)/4)",
            "& .stepper-progress-bar": {
                height: "calc(var(--basic-padding)/2)",
                backgroundColor: "var(--stepper-color)",
                borderRadius: "12px",
                "& .active-progress-bar": {
                    height: "calc(var(--basic-padding)/2)",
                    backgroundColor: "var(--primary-color)",
                    borderRadius: "inherit",
                }
            },
            "& .stepper-progress-detail": {
                flexDirection: "row",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "calc(var(--flex-gap)/4)",
            },
        },
        "& .call-to-action-stack": {
            gap: "calc(var(--flex-gap)/2)",
        },
    }
})