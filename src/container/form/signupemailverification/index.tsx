import { useContext, useRef, useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { SignUpFormPropsType } from "../../../type/container.type";
import { SignUpEmailVerificationFormWrapper } from "./styled";
import { BaseButton } from "../../../component/button/styled";
import arrowBackIcon from "../../../asset/icon/arrow-left.svg";
import { BaseLegend } from "../../../component/form/legend/styled";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseInput } from "../../../component/form/input/styled";
import { AppContext } from "../../../context/appContext";

export const SignUpEmailVerificationForm: React.FC<SignUpFormPropsType> = ({ error, setError, formDetails, setFormDetails }) => {
    const {
        setSignUpActiveTabIndex
    } = useContext(AppContext);

    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setFormDetails((prev) => ({
            ...prev,
            otp: newOtp.join("")
        }));
        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        };
    };

    const handleNavigate = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
        if (e.key === "Backspace") {
            if (otp[index] === "" && index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        } else if (e.key === "ArrowRight" && index < otp.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleNavigateToSignUp = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setError && setError(null);
        return setSignUpActiveTabIndex(0);
    };

    return (
        <SignUpEmailVerificationFormWrapper>
            <Box
                overflow={"hidden"}
            >
                <BaseButton
                    disableElevation
                    startIcon={
                        <img
                            src={arrowBackIcon}
                            alt="arrow back icon"
                        />
                    }
                    padding="calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)"
                    onClick={handleNavigateToSignUp}
                >
                    <Typography
                        variant={"button"}
                        fontFamily={"inherit"}
                        fontWeight={"inherit"}
                        fontSize={"inherit"}
                        lineHeight={"inherit"}
                        color={"inherit"}
                        textTransform={"inherit"}
                    >
                        Back
                    </Typography>
                </BaseButton>
            </Box>
            <Box>
                <BaseLegend>Verify Email Address</BaseLegend>
                <Typography
                    variant="body1"
                    fontFamily={"Inter"}
                    fontWeight={400}
                    fontSize={"14px"}
                    lineHeight={"normal"}
                    color="var(--dark-color)"
                    whiteSpace={"normal"}
                    marginBlockStart={"calc(var(--basic-margin)/4)"}
                >
                    We sent a 6-digit code to {formDetails.email}, please enter the code below.
                </Typography>
            </Box>
            <Grid
                container
                justifyContent={"space-between"}
                spacing={{ mobile: "calc(var(--flex-gap)/2)", laptop: "var(--flex-gap)" }}
            >
                {otp.map((digit, index) => (
                    <Grid
                        key={index}
                        flexGrow={1}
                        size={{ mobile: 2 }}
                    >
                        <BaseFieldSet>
                            <BaseInput
                                required
                                value={digit}
                                inputProps={{ maxLength: 1 }}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleNavigate(e, index)}
                                onFocus={() => setFocusedIndex(index)}
                                onBlur={() => setFocusedIndex(null)}
                                inputRef={(el) => (inputRefs.current[index] = el)}
                                border={
                                    error ? "1px solid var(--form-field-error-border-color)"
                                        : focusedIndex === index
                                            ? "1px solid var(--primary-color)"
                                            : "1px solid var(--border-color)"
                                }
                                bgcolor={error ? "var(--form-field-error-color)" : "transparent"}
                            />
                        </BaseFieldSet>
                    </Grid>
                ))}
            </Grid>

        </SignUpEmailVerificationFormWrapper >
    )
}