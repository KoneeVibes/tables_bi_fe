import { SignInWrapper } from "./styled";
import { AuthLayout } from "../../../container/layout/auth";
import { signInUser } from "../../../util/authentication/signIn";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import Cookies from "universal-cookie";
import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import logo from "../../../asset/icon/logo-on-light-bg.svg";
import { BaseLegend } from "../../../component/form/legend/styled";
import { AppContext } from "../../../context/appContext";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseLabel } from "../../../component/form/label/styled";
import { BaseInput } from "../../../component/form/input/styled";
import { BaseButton } from "../../../component/button/styled";

export const SignIn = () => {
    const cookies = new Cookies();

    const {
        setSignUpActiveTabIndex
    } = useContext(AppContext);
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formDetails, setFormDetails] = useState<Record<string, any>>({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNavigateToSignUp = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.preventDefault();
        navigate("/signup");
        return setSignUpActiveTabIndex(0);
    };

    const handleSignInUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const response = await signInUser(formDetails);
            if (response.status === "success") {
                setIsLoading(false);
                cookies.set("TOKEN", response.token, {
                    path: "/",
                });
                navigate("/dashboard");
            } else {
                setIsLoading(false);
                setError('Authentication failed. Please check your credentials and try again.');
            }
        } catch (error: any) {
            setIsLoading(false);
            setError(`Login failed. ${error.message}`);
            console.error('Login failed:', error);
        }
    };

    return (
        <AuthLayout>
            <SignInWrapper
                onSubmit={handleSignInUser}
            >
                <Stack
                    className="logo-box"
                >
                    <img
                        src={logo}
                        alt="application logo"
                    />
                </Stack>
                <Box>
                    <BaseLegend>Welcome Back</BaseLegend>
                    <Typography
                        variant="body1"
                        fontFamily={"Inter"}
                        fontWeight={400}
                        fontSize={"14px"}
                        lineHeight={"normal"}
                        color="var(--dark-color)"
                        textAlign={"center"}
                        whiteSpace={"normal"}
                        marginBlockStart={"calc(var(--basic-margin)/4)"}
                    >
                        Don't have an account? <Typography
                            component={"span"}
                            fontFamily={"inherit"}
                            fontWeight={600}
                            fontSize={"inherit"}
                            lineHeight={"inherit"}
                            color="var(--primary-color)"
                            textAlign={"inherit"}
                            whiteSpace={"inherit"}
                            sx={{ cursor: "pointer" }}
                            onClick={handleNavigateToSignUp}
                        >
                            Sign Up
                        </Typography>
                    </Typography>
                </Box>
                <Grid
                    container
                    spacing={"var(--flex-gap)"}
                >
                    <Grid
                        size={{ mobile: 12 }}
                    >
                        <BaseFieldSet>
                            <BaseLabel>
                                Email Address
                            </BaseLabel>
                            <BaseInput
                                required
                                type="email"
                                name="email"
                                value={formDetails.email}
                                placeholder="youremail@company.com"
                                onChange={(e) => handleChange(e)}
                            />
                        </BaseFieldSet>
                    </Grid>
                    <Grid
                        size={{ mobile: 12 }}
                    >
                        <BaseFieldSet>
                            <BaseLabel>
                                Password
                            </BaseLabel>
                            <BaseInput
                                required
                                type="password"
                                name="password"
                                value={formDetails.password}
                                placeholder="Enter password"
                                onChange={(e) => handleChange(e)}
                            />
                        </BaseFieldSet>
                    </Grid>
                </Grid>
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
                                Login
                            </Typography>
                        )}
                    </BaseButton>
                </Box>
            </SignInWrapper>
        </AuthLayout>
    )
}