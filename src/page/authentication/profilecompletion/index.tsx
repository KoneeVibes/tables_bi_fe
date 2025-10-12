import { useContext, useState } from "react";
import { AuthLayout } from "../../../container/layout/auth";
import { ProfileCompletionWrapper } from "./styled";
import { AppContext } from "../../../context/appContext";
import { UpdateJobTitleForm } from "../../../container/form/updatejobtile";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { BaseButton } from "../../../component/button/styled";
import { useNavigate, useParams } from "react-router-dom";
import { completeUserProfileService } from "../../../util/authentication/completeProfile";
import { UpdatePurposeForm } from "../../../container/form/updatepurpose";
import { UpdateAcquisitionMethodForm } from "../../../container/form/updateacquisitionmethod";

export const ProfileCompletion = () => {
	const steps = ["Choose Roles", "Choose Intents", "Choose Acquisition Method"];

	const { id = "" } = useParams();
	const {
		profileCompletionActiveTabIndex,
		setProfileCompletionActiveTabIndex,
	} = useContext(AppContext);
	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [formDetails, setFormDetails] = useState<Record<string, any>>({
		jobTitle: [],
		purpose: [],
		acquisitionMethod: [],
	});

	const handleNavigateToPrevious = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		setError(null);
		if (profileCompletionActiveTabIndex === 0) {
			navigate("/");
		} else {
			setProfileCompletionActiveTabIndex((prev) => prev - 1);
		}
		return;
	};

	const handleCompleteUserProfile = async () => {
		try {
			const response = await completeUserProfileService(formDetails, id);
			if (response.status === "success") {
				setIsLoading(false);
				navigate("/");
			} else {
				setIsLoading(false);
				setError(
					"Profile completion failed. Please check your credentials and try again."
				);
			}
		} catch (error: any) {
			setIsLoading(false);
			setError(`Profile completion failed. ${error.message}`);
			console.error("Profile completion failed:", error);
		}
	};

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError(null);
		profileCompletionActiveTabIndex === steps.length - 1 && setIsLoading(true);
		switch (profileCompletionActiveTabIndex) {
			case 0:
			case 1:
				setProfileCompletionActiveTabIndex((prev) => prev + 1);
				break;
			case 2:
				await handleCompleteUserProfile();
				break;
			default:
				break;
		}
	};

	return (
		<AuthLayout>
			<ProfileCompletionWrapper onSubmit={handleFormSubmit}>
				<Stack className="stepper">
					<Stack className="stepper-progress-bar">
						<Box
							component="div"
							className="active-progress-bar"
							sx={{
								width: `${
									((profileCompletionActiveTabIndex + 1) / steps.length) * 100
								}%`,
								transition: "width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
							}}
						/>
					</Stack>
					<Stack className="stepper-progress-detail">
						<Box overflow={"hidden"}>
							<Typography
								variant="subtitle1"
								fontFamily={"Inter"}
								fontWeight={500}
								fontSize={"14px"}
								lineHeight={"normal"}
								color="var(--subtitle-grey-color)"
								whiteSpace={"normal"}
							>
								{steps[profileCompletionActiveTabIndex]}
							</Typography>
						</Box>
						<Box overflow={"hidden"}>
							<Typography
								variant="subtitle1"
								fontFamily={"Inter"}
								fontWeight={500}
								fontSize={"14px"}
								lineHeight={"normal"}
								color="var(--subtitle-grey-color)"
								whiteSpace={"normal"}
							>
								{`${profileCompletionActiveTabIndex + 1} of ${steps.length}`}
							</Typography>
						</Box>
					</Stack>
				</Stack>
				{profileCompletionActiveTabIndex === 0 && (
					<UpdateJobTitleForm
						formDetails={formDetails}
						setFormDetails={setFormDetails}
					/>
				)}
				{profileCompletionActiveTabIndex === 1 && (
					<UpdatePurposeForm
						formDetails={formDetails}
						setFormDetails={setFormDetails}
					/>
				)}
				{profileCompletionActiveTabIndex === 2 && (
					<UpdateAcquisitionMethodForm
						formDetails={formDetails}
						setFormDetails={setFormDetails}
					/>
				)}
				{error && (
					<Box>
						<Typography
							fontFamily={"Inter"}
							fontWeight={"600"}
							fontSize={14}
							lineHeight={"normal"}
							color={"var(--error-red-color)"}
							whiteSpace={"normal"}
							textAlign={"center"}
						>
							{error}
						</Typography>
					</Box>
				)}
				<Stack className="call-to-action-stack">
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
								{profileCompletionActiveTabIndex === 2 ? "Finish" : "Continue"}
							</Typography>
						</BaseButton>
					</Box>
					<Box overflow={"hidden"}>
						<BaseButton
							disableElevation
							disabled={isLoading}
							sx={{ width: "100%" }}
							onClick={handleNavigateToPrevious}
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
								{profileCompletionActiveTabIndex === 0 ? "Skip" : "Previous"}
							</Typography>
						</BaseButton>
					</Box>
				</Stack>
			</ProfileCompletionWrapper>
		</AuthLayout>
	);
};
