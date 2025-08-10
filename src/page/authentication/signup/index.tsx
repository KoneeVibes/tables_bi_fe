import { Fragment, useContext, useEffect, useState } from "react";
import { SignUpWrapper } from "./styled";
import { AuthLayout } from "../../../container/layout/auth";
import { SignUpForm } from "../../../container/form/signup";
import { Box, CircularProgress, Typography } from "@mui/material";
import { BaseButton } from "../../../component/button/styled";
import { SignUpEmailVerificationForm } from "../../../container/form/signupemailverification";
import { AppContext } from "../../../context/appContext";
import { signUpUser } from "../../../util/authentication/signUp";
import { verifyAuthOtp } from "../../../util/authentication/verifyOtp";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
    const {
        signUpActiveTabIndex,
        setSignUpActiveTabIndex
    } = useContext(AppContext);
    const navigate = useNavigate();

    const COUNTDOWN_SECONDS = 5 * 60;

    const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);
    const [endTime, setEndTime] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasOTPResent, setHasOTPResent] = useState(false);
    const [isResendOTPLoading, setIsResendOTPLoading] = useState(false);
    const [formDetails, setFormDetails] = useState<Record<string, any>>({
        firstName: "",
        lastName: "",
        email: "",
        organization: "",
        password: "",
        confirmPassword: "",
        otp: "",
    });

    useEffect(() => {
        // Reset the states - hasOTPResent, isLoading
        // and isResendOTP when tab index is not 0.1 or 1.
        if (signUpActiveTabIndex === 0) {
            setHasOTPResent(false);
            setIsLoading(false);
            setIsResendOTPLoading(false);
        };

        // restart the time count whenever the verification
        // screen is rendered afresh or OTP is resent
        if (signUpActiveTabIndex === 1 || hasOTPResent) {
            const newEndTime = Date.now() + COUNTDOWN_SECONDS * 1000;
            setEndTime(newEndTime);
            setTimeLeft(COUNTDOWN_SECONDS);
        }
    }, [signUpActiveTabIndex, hasOTPResent, COUNTDOWN_SECONDS]);

    useEffect(() => {
        if (!endTime) return;

        const timer = setInterval(() => {
            const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000));
            setTimeLeft(remaining);

            if (remaining <= 0) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    const handleSignUpUser = async (payload: Record<string, any>, tabIndex: number) => {
        try {
            const response = await signUpUser(payload);
            if (response.status === "success") {
                tabIndex === 0.1 ?
                    setIsResendOTPLoading(false)
                    : setIsLoading(false);
                setSignUpActiveTabIndex(1);
            } else {
                tabIndex === 0.1 ?
                    setIsResendOTPLoading(false)
                    : setIsLoading(false);
                setError('Signup failed. Please check your credentials and try again.');
            }
        } catch (error: any) {
            tabIndex === 0.1 ?
                setIsResendOTPLoading(false)
                : setIsLoading(false);
            setError(`Signup failed. ${error.message}`);
            console.error('Signup failed:', error);
        }
    };

    const handleVerifyOtp = async (otp: Record<string, any>) => {
        try {
            const response = await verifyAuthOtp(otp);
            if (response.status === "success") {
                setIsLoading(false);
                setSignUpActiveTabIndex(0);
                navigate(`/complete-profile/${response.data.id}`);
            } else {
                setIsLoading(false);
                setError('OTP verification failed. Please check your credentials and try again.');
            }
        } catch (error: any) {
            setIsLoading(false);
            setError(`OTP verification failed. ${error.message}`);
            console.error('OTP verification failed:', error);
        }
    };

    const handleResendOTP = async (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        setError(null);
        setSignUpActiveTabIndex(0.1);
        await handleFormSubmit(e, 0.1);
        return setHasOTPResent(true);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLSpanElement, MouseEvent>, tabIndex: number) => {
        e.preventDefault();
        setError(null);
        tabIndex === 0.1 ?
            setIsResendOTPLoading(true)
            : setIsLoading(true);
        let payload;
        switch (tabIndex) {
            case 0:
            case 0.1:
                payload = {
                    firstName: formDetails.firstName,
                    lastName: formDetails.lastName,
                    email: formDetails.email,
                    organization: formDetails.organization,
                    password: formDetails.password,
                    confirmPassword: formDetails.confirmPassword
                };
                await handleSignUpUser(payload, tabIndex);
                break;
            case 1:
                payload = {
                    email: formDetails.email,
                    otp: formDetails.otp,
                };
                await handleVerifyOtp(payload);
                break;
            default:
                break;
        }
    };

    return (
        <AuthLayout>
            <SignUpWrapper
                onSubmit={(e) => handleFormSubmit(e, signUpActiveTabIndex)}
            >
                {signUpActiveTabIndex === 0 && (
                    <SignUpForm
                        formDetails={formDetails}
                        setFormDetails={setFormDetails}
                    />
                )}
                {(signUpActiveTabIndex === 0.1 || signUpActiveTabIndex === 1) && (
                    <SignUpEmailVerificationForm
                        error={error}
                        setError={setError}
                        formDetails={formDetails}
                        setFormDetails={setFormDetails}
                    />
                )}
                {(signUpActiveTabIndex === 0.1 || signUpActiveTabIndex === 1) && (
                    <Box>
                        <Typography
                            fontFamily={"Inter"}
                            fontWeight={"600"}
                            fontSize={14}
                            lineHeight={"normal"}
                            color={"var(--dark-color)"}
                            whiteSpace={"normal"}
                            display={"flex"}
                            alignItems={"center"}
                            justifyContent={"center"}
                            gap={"calc(var(--flex-gap)/8)"}
                        >
                            {timeLeft > 0 ? (
                                <Fragment>
                                    <Typography
                                        component={"span"}
                                        fontFamily={"inherit"}
                                        fontWeight={"inherit"}
                                        fontSize={"inherit"}
                                        lineHeight={"normal"}
                                        color={"inherit"}
                                        whiteSpace={"normal"}
                                    >
                                        Code expires in
                                    </Typography>
                                    <Typography
                                        component={"span"}
                                        fontFamily={"inherit"}
                                        fontWeight={"inherit"}
                                        fontSize={"inherit"}
                                        lineHeight={"normal"}
                                        color={"var(--primary-color)"}
                                        whiteSpace={"normal"}
                                        sx={{ cursor: "pointer" }}
                                        onClick={handleResendOTP}
                                    >
                                        {`${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, "0")}`}
                                    </Typography>
                                </Fragment>
                            ) : (
                                <Typography
                                    component={"span"}
                                    fontFamily={"inherit"}
                                    fontWeight={"inherit"}
                                    fontSize={"inherit"}
                                    lineHeight={"normal"}
                                    color={"inherit"}
                                    whiteSpace={"normal"}
                                >
                                    OTP Expired
                                </Typography>
                            )}
                        </Typography>
                    </Box>
                )}
                {error && (
                    <Box>
                        < Typography
                            fontFamily={"Inter"}
                            fontWeight={"600"}
                            fontSize={14}
                            lineHeight={"normal"}
                            color={"var(--error-red-color)"}
                            whiteSpace={"normal"}
                            textAlign={signUpActiveTabIndex === 0 ? "left" : "center"}
                        >
                            {error}
                        </Typography>
                    </Box>
                )}
                {(signUpActiveTabIndex === 0.1 || signUpActiveTabIndex === 1) && (
                    <Box>
                        {hasOTPResent ? (
                            <Typography
                                fontFamily={"Roboto"}
                                fontWeight={"400"}
                                fontSize={15}
                                lineHeight={"normal"}
                                color={"var(--primary-color)"}
                                whiteSpace={"normal"}
                                textAlign={"center"}
                            >
                                Resent!
                            </Typography>
                        ) : (
                            <Typography
                                fontFamily={"Inter"}
                                fontWeight={"500"}
                                fontSize={14}
                                lineHeight={"normal"}
                                color={"var(--subtitle-grey-color)"}
                                whiteSpace={"normal"}
                                display={"flex"}
                                alignItems={"center"}
                                justifyContent={"center"}
                                gap={"calc(var(--flex-gap)/8)"}
                            >
                                <Typography
                                    component={"span"}
                                    fontFamily={"inherit"}
                                    fontWeight={"inherit"}
                                    fontSize={"inherit"}
                                    lineHeight={"normal"}
                                    color={"inherit"}
                                    whiteSpace={"normal"}
                                >
                                    Didn't receive any code?
                                </Typography>
                                {isResendOTPLoading ? (
                                    <CircularProgress
                                        className="loader"
                                        style={{ color: "var(--primary-color)" }}
                                    />
                                ) : (
                                    <Typography
                                        component={"span"}
                                        fontFamily={"inherit"}
                                        fontWeight={"inherit"}
                                        fontSize={"inherit"}
                                        lineHeight={"normal"}
                                        color={"var(--primary-color)"}
                                        whiteSpace={"normal"}
                                        sx={{ cursor: "pointer" }}
                                        onClick={handleResendOTP}
                                    >
                                        Resend OTP
                                    </Typography>
                                )}
                            </Typography>
                        )}
                    </Box>
                )}
                <Box
                    overflow={"hidden"}
                >
                    <BaseButton
                        type="submit"
                        variant="contained"
                        disableElevation
                        disabled={isLoading || isResendOTPLoading}
                        sx={{ width: "100%" }}
                    >
                        {isLoading ? (
                            <CircularProgress color="inherit" className="loader" />
                        ) : (
                            <Typography
                                variant={"button"}
                                fontFamily={"inherit"}
                                fontWeight={"inherit"}
                                fontSize={"inherit"}
                                lineHeight={"inherit"}
                                color={"inherit"}
                                textTransform={"inherit"}
                            >
                                {signUpActiveTabIndex === 0 ? "Create Account"
                                    : "Verify"}
                            </Typography>
                        )}
                    </BaseButton>
                </Box>
            </SignUpWrapper>
        </AuthLayout >
    )
}