import { SignInWrapper } from "./styled";
import { AuthLayout } from "../../../container/layout/auth";
import { signInUserService } from "../../../util/authentication/signIn";
import { useNavigate } from "react-router-dom";
import { Fragment, useContext, useState } from "react";
import Cookies from "universal-cookie";
import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import logo from "../../../asset/icon/logo-on-light-bg.svg";
import { BaseLegend } from "../../../component/form/legend/styled";
import { AppContext } from "../../../context/appContext";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseLabel } from "../../../component/form/label/styled";
import { BaseInput } from "../../../component/form/input/styled";
import { BaseButton } from "../../../component/button/styled";
import arrowBackIcon from "../../../asset/icon/arrow-left.svg";
import { EmailVerificationForm } from "../../../container/form/emailverification";
import { verifyAuthOtpService } from "../../../util/authentication/verifyOtp";
import { sendAuthOtpService } from "../../../util/authentication/sendOtp";
import { resetPasswordService } from "../../../util/authentication/resetPassword";

export const SignIn = () => {
	const cookies = new Cookies();

	const {
		setSignUpActiveTabIndex,
		signInActiveTabIndex,
		setSignInActiveTabIndex,
	} = useContext(AppContext);
	const navigate = useNavigate();

	const [userId, setUserId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formDetails, setFormDetails] = useState<Record<string, any>>({
		email: "",
		password: "",
		otp: "",
		newPassword: "",
		confirmNewPassword: "",
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormDetails((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleNavigateToSignUp = (
		e: React.MouseEvent<HTMLSpanElement, MouseEvent>
	) => {
		e.preventDefault();
		navigate("/signup");
		return setSignUpActiveTabIndex(0);
	};

	const handleNavigateToPasswordResetTab = (
		e: React.MouseEvent<HTMLParagraphElement, MouseEvent>
	) => {
		e.stopPropagation();
		if (isLoading) return;
		setError(null);
		return setSignInActiveTabIndex(1);
	};

	const handleNavigateToSignInTab = (
		e: React.MouseEvent<HTMLSpanElement, MouseEvent>
	) => {
		e.stopPropagation();
		setError(null);
		return setSignInActiveTabIndex(0);
	};

	const handleSignInUser = async (payload: Record<string, any>) => {
		try {
			const response = await signInUserService(payload);
			if (response.status === "success") {
				setIsLoading(false);
				cookies.set("TOKEN", response.token, {
					path: "/",
				});
				navigate("/dashboard");
			} else {
				setIsLoading(false);
				setError(
					"Authentication failed. Please check your credentials and try again."
				);
			}
		} catch (error: any) {
			setIsLoading(false);
			setError(`Login failed. ${error.message}`);
			console.error("Login failed:", error);
		}
	};

	const handleSendAuthOtp = async (payload: Record<string, any>) => {
		try {
			const response = await sendAuthOtpService(payload);
			if (response.status === "success") {
				setIsLoading(false);
				setSignInActiveTabIndex(2);
			} else {
				setIsLoading(false);
				setError("Failed to send OTP. Please  try again.");
			}
		} catch (error: any) {
			setIsLoading(false);
			setError(`Failed to send OTP. ${error.message}`);
			console.error("Failed to send OTP:", error);
		}
	};

	const handleVerifyOtp = async (payload: Record<string, any>) => {
		try {
			const response = await verifyAuthOtpService(payload, {
				deleteOtp: "false",
			});
			if (response.status === "success") {
				setIsLoading(false);
				setUserId(response.data.id);
				setSignInActiveTabIndex(3);
			} else {
				setIsLoading(false);
				setError("OTP verification failed. Please  try again.");
			}
		} catch (error: any) {
			setIsLoading(false);
			setError(`OTP verification failed. ${error.message}`);
			console.error("OTP verification failed:", error);
		}
	};

	const handleResetPassword = async (payload: Record<string, any>) => {
		try {
			const response = await resetPasswordService(payload, userId!);
			if (response.status === "success") {
				setIsLoading(false);
				setUserId(null);
				setSignInActiveTabIndex(0);
			} else {
				setIsLoading(false);
				setError("Password reset failed. Please  try again.");
			}
		} catch (error: any) {
			setIsLoading(false);
			setError(`Password reset failed. ${error.message}`);
			console.error("Password reset failed:", error);
		}
	};

	const handleFormSubmit = async (
		e:
			| React.FormEvent<HTMLFormElement>
			| React.MouseEvent<HTMLSpanElement, MouseEvent>,
		tabIndex: number
	) => {
		e.preventDefault();
		setError(null);
		setIsLoading(true);
		let payload;
		switch (tabIndex) {
			case 0:
				payload = {
					email: formDetails.email,
					password: formDetails.password,
				};
				await handleSignInUser(payload);
				break;
			case 1:
				payload = {
					email: formDetails.email,
				};
				await handleSendAuthOtp(payload);
				break;
			case 2:
				payload = {
					email: formDetails.email,
					otp: formDetails.otp,
				};
				await handleVerifyOtp(payload);
				break;
			case 3:
				payload = {
					newPassword: formDetails.newPassword,
					confirmNewPassword: formDetails.confirmNewPassword,
				};
				await handleResetPassword(payload);
				break;
			default:
				break;
		}
	};

	return (
		<AuthLayout>
			<SignInWrapper
				onSubmit={(e) => handleFormSubmit(e, signInActiveTabIndex)}
			>
				{signInActiveTabIndex === 0 && (
					<Fragment>
						<Stack className="logo-box">
							<img src={logo} alt="application logo" />
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
								Don't have an account?{" "}
								<Typography
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
						<Grid container spacing={"var(--flex-gap)"}>
							<Grid size={{ mobile: 12 }}>
								<BaseFieldSet>
									<BaseLabel>Email Address</BaseLabel>
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
							<Grid size={{ mobile: 12 }}>
								<BaseFieldSet>
									<BaseLabel>Password</BaseLabel>
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
						<Box display={"flex"} justifyContent={{ miniTablet: "flex-end" }}>
							<Typography
								component={"p"}
								fontFamily={"Inter"}
								fontWeight={"600"}
								fontSize={12}
								lineHeight={"normal"}
								color={"var(--primary-color)"}
								whiteSpace={"normal"}
								sx={{ cursor: "pointer" }}
								onClick={handleNavigateToPasswordResetTab}
							>
								Forgot Password?
							</Typography>
						</Box>
					</Fragment>
				)}
				{signInActiveTabIndex === 1 && (
					<Fragment>
						<Box overflow={"hidden"}>
							<BaseButton
								disableElevation
								startIcon={<img src={arrowBackIcon} alt="arrow back icon" />}
								padding="calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)"
								onClick={handleNavigateToSignInTab}
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
							<BaseLegend align="left">Forgot Password</BaseLegend>
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
								Kindly enter the email you used to create your account to reset
								your password. A code will be sent to that email.
							</Typography>
						</Box>
						<Grid container spacing={"var(--flex-gap)"}>
							<Grid size={{ mobile: 12 }}>
								<BaseFieldSet>
									<BaseLabel>Email Address</BaseLabel>
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
						</Grid>
					</Fragment>
				)}
				{signInActiveTabIndex === 2 && (
					<EmailVerificationForm
						error={error}
						formDetails={formDetails}
						setFormDetails={setFormDetails}
						navigateBack={handleNavigateToSignInTab}
					/>
				)}
				{signInActiveTabIndex === 3 && (
					<Fragment>
						<Box>
							<BaseLegend align="left">Set New Password</BaseLegend>
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
								Kindly create a new password below to reset your account
								password.
							</Typography>
						</Box>
						<Grid container spacing={"var(--flex-gap)"}>
							<Grid size={{ mobile: 12 }}>
								<BaseFieldSet>
									<BaseLabel>New Password</BaseLabel>
									<BaseInput
										required
										type="password"
										name="newPassword"
										value={formDetails.newPassword}
										placeholder="Enter new password"
										onChange={(e) => handleChange(e)}
									/>
								</BaseFieldSet>
							</Grid>
							<Grid size={{ mobile: 12 }}>
								<BaseFieldSet>
									<BaseLabel>Confirm New Password</BaseLabel>
									<BaseInput
										required
										type="password"
										name="confirmNewPassword"
										value={formDetails.confirmNewPassword}
										placeholder="Confirm new password"
										onChange={(e) => handleChange(e)}
									/>
								</BaseFieldSet>
							</Grid>
						</Grid>
					</Fragment>
				)}
				{error && (
					<Typography
						fontFamily={"Inter"}
						fontWeight={"600"}
						fontSize={14}
						lineHeight={"normal"}
						color={"var(--error-red-color)"}
						whiteSpace={"normal"}
					>
						{error}
					</Typography>
				)}
				<Box overflow={"hidden"}>
					<BaseButton
						type="submit"
						variant="contained"
						disableElevation
						disabled={isLoading}
						sx={{ width: "100%" }}
					>
						{isLoading && (
							<CircularProgress color="inherit" className="loader" />
						)}
						<Typography
							variant={"button"}
							fontFamily={"inherit"}
							fontWeight={"inherit"}
							fontSize={"inherit"}
							lineHeight={"inherit"}
							color={"inherit"}
							textTransform={"inherit"}
							visibility={isLoading ? "hidden" : "visible"}
						>
							{signInActiveTabIndex === 0
								? "Login"
								: signInActiveTabIndex === 1
								? "Verify Email"
								: signInActiveTabIndex === 2
								? "Verify OTP"
								: "Reset Password"}
						</Typography>
					</BaseButton>
				</Box>
			</SignInWrapper>
		</AuthLayout>
	);
};
