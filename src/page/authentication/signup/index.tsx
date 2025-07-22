import { useContext, useState } from "react";
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

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formDetails, setFormDetails] = useState<Record<string, any>>({
        firstName: "",
        lastName: "",
        email: "",
        organization: "",
        password: "",
        confirmPassword: "",
        otp: "",
    });

    const handleSignUpUser = async (payload: Record<string, any>) => {
        try {
            const response = await signUpUser(payload);
            if (response.status === "success") {
                setIsLoading(false);
                setSignUpActiveTabIndex(1);
            } else {
                setIsLoading(false);
                setError('Signup failed. Please check your credentials and try again.');
            }
        } catch (error: any) {
            setIsLoading(false);
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
                navigate("/");
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

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        let payload;
        switch (signUpActiveTabIndex) {
            case 0:
                payload = {
                    firstName: formDetails.firstName,
                    lastName: formDetails.lastName,
                    email: formDetails.email,
                    organization: formDetails.organization,
                    password: formDetails.password,
                    confirmPassword: formDetails.confirmPassword
                };
                await handleSignUpUser(payload);
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
                onSubmit={handleFormSubmit}
            >
                {signUpActiveTabIndex === 0 && (
                    <SignUpForm
                        formDetails={formDetails}
                        setFormDetails={setFormDetails}
                    />
                )}
                {signUpActiveTabIndex === 1 && (
                    <SignUpEmailVerificationForm
                        formDetails={formDetails}
                        setFormDetails={setFormDetails}
                    />
                )}
                {error && <Typography
                    fontFamily={"Inter"}
                    fontWeight={"600"}
                    fontSize={14}
                    lineHeight={"normal"}
                    color={"var(--error-red-color)"}
                    whiteSpace={"normal"}
                >
                    {error}
                </Typography>}
                <Box
                    overflow={"hidden"}
                >
                    <BaseButton
                        type="submit"
                        variant="contained"
                        disableElevation
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
        </AuthLayout>
    )
}