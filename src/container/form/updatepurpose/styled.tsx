import { Stack, styled } from "@mui/material";
import checkedIcon from "../../../asset/icon/input-checked-icon.svg";

export const UpdatePurposeFormWrapper = styled(Stack)(() => {
    return {
        gap: "var(--flex-gap)",
        "& fieldset": {
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            "& .MuiInputBase-input": {
                width: "20px",
                height: "20px",
                appearance: "none",
                borderRadius: "4px",
                "&:checked": {
                    backgroundImage: `url(${checkedIcon})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                },
                "&:hover:not(:checked)": {
                    border: "1px solid var(--primary-color)",
                },
            },
        },
    }
})
