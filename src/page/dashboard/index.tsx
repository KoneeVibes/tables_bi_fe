import { useEffect, useState } from "react";
import { Box, CircularProgress, Grid, Stack, Typography } from "@mui/material";
import { AppLayout } from "../../container/layout/app";
import { DashboardWrapper } from "./styled";
import { coreFeatures, supportedDataSources } from "../../config/static";
import { BaseFieldSet } from "../../component/form/fieldset/styled";
import { BaseLabel } from "../../component/form/label/styled";
import { BaseInput } from "../../component/form/input/styled";
import { BaseButton } from "../../component/button/styled";
import { DatabaseConnectionForm } from "../../container/form/databaseconnection";
import { connectToDB } from "../../util/connection/connectToDB";
import Cookies from "universal-cookie";
import { BaseAlertModal } from "../../component/modal/alert";
import spinner from "../../asset/icon/spinner-icon.svg";
import errorIcon from "../../asset/icon/error-icon.svg";
import confetti from "../../asset/image/success-confetti.png";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
	const connectionHints = [
		"Ensure the Host URL is correct.",
		"Confirm that your username and password are accurate.",
		"Verify that your connection port (5432) is open and accessible.",
		"If you're using a cloud provider (e.g., AWS), check that the database instance is running.",
	];

	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const navigate = useNavigate();

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
	const [isConnectionSuccessful, setIsConnectionSuccessful] = useState(false);
	const [alertModalTexts, setAlertModalTexts] = useState<Record<string, any>>({
		header: "Establishing connection..",
		body: "Please wait while we connect to the database. This might take a few seconds",
	});
	const [dataSource, setDataSource] = useState<Record<string, any>>(
		localStorage.getItem("dataSource")
			? JSON.parse(localStorage.getItem("dataSource") as string)
			: { name: "" }
	);
	const [connectionDetails, setConnectionDetails] = useState<
		Record<string, any>
	>({
		host: "",
		port: "",
		username: "",
		password: "",
		dbName: "",
	});

	const handleDataSourceChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setDataSource((prev) => {
			const updated = {
				...prev,
				[name]: value,
			};
			localStorage.setItem("dataSource", JSON.stringify(updated));
			return updated;
		});
	};

	const handleAlertModalPersist = () => {
		if (isLoading) return;
		setIsAlertModalOpen(false);
	};

	const handleNavigateToConnection = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		handleAlertModalPersist();
		return navigate("/connection");
	};

	const handleDatabaseConnection = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		if (!dataSource.name) {
			return setError("Please select a datasource to proceed.");
		}
		setError(null);
		setIsLoading(true);
		setIsAlertModalOpen(true);
		setIsConnectionSuccessful(false);
		setAlertModalTexts({
			header: "Establishing connection..",
			body: "Please wait while we connect to the database. This might take a few seconds",
		});
		const messages = [
			{
				header: "Establishing connection..",
				body: "Please wait while we connect to the database. This might take a few seconds",
			},
			{
				header: "Verifying credentials...",
				body: "Checking your database credentials to ensure everything is correct.",
			},
			{
				header: "Retrieving data...",
				body: "Almost there... fetching database information.",
			},
		];
		let index = 0;
		const interval = setInterval(() => {
			index++;
			if (index < messages.length) {
				setAlertModalTexts(messages[index]);
			}
		}, 2000);
		try {
			const response = await connectToDB(
				TOKEN,
				connectionDetails,
				dataSource.name
			);
			clearInterval(interval);
			if (response.status === "success") {
				setIsLoading(false);
				setAlertModalTexts({
					header: "Connection Successful!",
					body: "Your database connection has been established successfully.",
				});
				setIsConnectionSuccessful(true);
			} else {
				setIsLoading(false);
				setAlertModalTexts({
					header: "Connection Failed",
					body: "We couldn't connect to your database. Please check the following:",
				});
				setError(
					"Connection failed. Please check your credentials and try again."
				);
			}
		} catch (error: any) {
			clearInterval(interval);
			setIsLoading(false);
			setAlertModalTexts({
				header: "Connection Failed",
				body: "We couldn't connect to your database. Please check the following:",
			});
			setError(`Connection failed. ${error.message}`);
			console.error("Connection failed:", error);
		}
	};

	useEffect(() => {
		const handleStorageChange = (event: StorageEvent) => {
			if (event.key === "dataSource" && event.newValue) {
				setDataSource(JSON.parse(event.newValue));
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => window.removeEventListener("storage", handleStorageChange);
	}, []);

	const alertIcon = (
		<Box
			component={"div"}
			className={`alert-modal-item ${
				error
					? "alert-modal-icon"
					: isConnectionSuccessful
					? "alert-modal-icon alert-modal-confetti-icon"
					: "alert-modal-icon alert-modal-spinning-icon"
			}`}
		>
			<img
				src={error ? errorIcon : isConnectionSuccessful ? confetti : spinner}
				alt={
					error
						? "Error Icon"
						: isConnectionSuccessful
						? "Success Confetti"
						: "Spinning Loader"
				}
			/>
		</Box>
	);

	const alertHeader = (
		<Box component={"div"} className="alert-modal-item alert-modal-header">
			<Typography
				variant="h3"
				fontFamily={"Inter"}
				fontWeight={600}
				fontSize={"20px"}
				lineHeight={"normal"}
				color="var(--form-header-color)"
				textAlign={"center"}
				whiteSpace={"normal"}
			>
				{alertModalTexts.header}
			</Typography>
		</Box>
	);

	const alertBody = (
		<Stack className="alert-modal-item alert-modal-body">
			<Box>
				<Typography
					variant="body1"
					fontFamily={"Inter"}
					fontWeight={500}
					fontSize={"14px"}
					lineHeight={"normal"}
					color="var(--form-header-color)"
					textAlign={"center"}
					whiteSpace={"normal"}
				>
					{alertModalTexts.body}
				</Typography>
			</Box>
			{isConnectionSuccessful && (
				<Box overflow={"hidden"}>
					<BaseButton
						disableElevation
						variant="contained"
						sx={{ width: "100%" }}
						onClick={handleNavigateToConnection}
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
							Continue to Connection
						</Typography>
					</BaseButton>
				</Box>
			)}
			{error && (
				<Box component={"div"} className="connection-hints">
					<ul>
						{connectionHints.map((hint, index) => (
							<li key={index}>{hint}</li>
						))}
					</ul>
				</Box>
			)}
			{error && (
				<Stack className="complaint-handling">
					<Box>
						<Typography
							variant="subtitle1"
							fontFamily={"Inter"}
							fontWeight={"600"}
							fontSize={14}
							lineHeight={"normal"}
							color={"var(--form-header-color)"}
							whiteSpace={"normal"}
						>
							Having issues?
						</Typography>
					</Box>
					<Box>
						<Typography
							variant="body1"
							fontFamily={"Inter"}
							fontWeight={"500"}
							fontSize={12}
							lineHeight={"normal"}
							color={"var(--subtitle-grey-color)"}
							whiteSpace={"normal"}
						>
							<Typography
								component={"a"}
								fontFamily={"inherit"}
								fontWeight={"inherit"}
								fontSize={"inherit"}
								lineHeight={"inherit"}
								color={"inherit"}
								textTransform={"inherit"}
								sx={{ textDecoration: "underline", cursor: "pointer" }}
							>
								Reach out to support
							</Typography>{" "}
							- we're happy to assist you.
						</Typography>
					</Box>
				</Stack>
			)}
		</Stack>
	);

	return (
		<AppLayout pageId="Dashboard" pageTitle="Dashboard">
			<DashboardWrapper>
				<BaseAlertModal
					open={isAlertModalOpen}
					icon={alertIcon}
					header={alertHeader}
					body={alertBody}
					className="alert-modal"
					handleClose={handleAlertModalPersist}
				/>
				<Box>
					<Typography
						variant="h2"
						fontFamily={"Inter"}
						fontWeight={700}
						fontSize={"24px"}
						lineHeight={"normal"}
						color="var(--dark-color)"
						textAlign={"center"}
						whiteSpace={"normal"}
						marginBottom={"calc(var(--basic-padding) / 4)"}
					>
						Welcome to TablesBI
					</Typography>
					<Typography
						variant="body1"
						fontFamily={"Inter"}
						fontWeight={500}
						fontSize={"14px"}
						lineHeight={"normal"}
						color="var(--subtitle-grey-color)"
						textAlign={"center"}
						whiteSpace={"normal"}
					>
						To get started, connect your database or explore a sample dataset.
					</Typography>
				</Box>
				<Stack className="db-type-selection">
					<Typography
						variant="h3"
						fontFamily={"Inter"}
						fontWeight={600}
						fontSize={"20px"}
						lineHeight={"normal"}
						color="var(--form-header-color)"
						textAlign={"center"}
						whiteSpace={"normal"}
						display={{ mobile: "none", miniTablet: "block" }}
					>
						Connect a database
					</Typography>
					<Grid container component={"div"} spacing={"var(--flex-gap)"}>
						{coreFeatures.map((feature, index) => (
							<Grid key={index} size={{ mobile: 6 }}>
								<Stack className="feature-item">
									<Box overflow={"hidden"}>
										<img
											src={feature.icon}
											alt="Feature Icon"
											className="feature-icon"
										/>
									</Box>
									<Box>
										<Typography
											variant="subtitle1"
											fontFamily={"Inter"}
											fontWeight={500}
											fontSize={"14px"}
											lineHeight={"normal"}
											color="var(--dark-color)"
											whiteSpace={"normal"}
										>
											{feature.description}
										</Typography>
									</Box>
								</Stack>
							</Grid>
						))}
					</Grid>
					<form className="datasource-form">
						<Grid container component={"div"} spacing={"var(--flex-gap)"}>
							{supportedDataSources.map((source, index) => (
								<Grid key={index} size={{ mobile: 6 }}>
									<BaseFieldSet className="datasource-fieldset">
										<BaseLabel>
											<Box display={"flex"} justifyContent={"flex-end"}>
												<BaseInput
													type="radio"
													name="name"
													value={source.name}
													inputProps={{
														checked: dataSource.name === source.name,
													}}
													onChange={handleDataSourceChange}
													sx={{
														padding: 0,
														width: "20px",
														height: "20px",
														cursor: "pointer",
														border:
															dataSource.name === source.name
																? "none"
																: "1px solid var(--form-unchecked-border-color)",
														borderRadius:
															dataSource.name === source.name ? "unset" : "50%",
													}}
												/>
											</Box>
											<Box display={"flex"} justifyContent={"center"}>
												<img
													src={source.icon}
													alt="Datasource Icon"
													className="datasource-icon"
												/>
											</Box>
											<Box display={"flex"} justifyContent={"center"}>
												<Typography
													variant="subtitle1"
													fontFamily={"Inter"}
													fontWeight={500}
													fontSize={"20px"}
													lineHeight={"normal"}
													color="var(--form-header-color)"
													whiteSpace={"normal"}
													textAlign={"center"}
												>
													{source.name.replace(/-/g, " ")}
												</Typography>
											</Box>
										</BaseLabel>
									</BaseFieldSet>
								</Grid>
							))}
						</Grid>
					</form>
				</Stack>
				<form
					className="database-information-form"
					onSubmit={handleDatabaseConnection}
				>
					<DatabaseConnectionForm
						formDetails={connectionDetails}
						setFormDetails={setConnectionDetails}
					/>
					{error && (
						<Box>
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
						</Box>
					)}
					<Box
						overflow={"hidden"}
						display={"flex"}
						justifyContent={{ tablet: "flex-end" }}
					>
						<BaseButton
							type="submit"
							variant="contained"
							disableElevation
							disabled={isLoading}
							sx={{ width: { mobile: "100%", tablet: "auto" } }}
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
									Test Connection
								</Typography>
							)}
						</BaseButton>
					</Box>
				</form>
				<Box component={"div"} className="complaint-box">
					<Stack className="complaint-box-content">
						<Box>
							<Typography
								variant="subtitle1"
								fontFamily={"Inter"}
								fontWeight={"600"}
								fontSize={18}
								lineHeight={"normal"}
								color={"var(--form-header-color)"}
								whiteSpace={"normal"}
							>
								Having issues?
							</Typography>
						</Box>
						<Box>
							<Typography
								variant="body1"
								fontFamily={"Inter"}
								fontWeight={"500"}
								fontSize={14}
								lineHeight={"normal"}
								color={"var(--subtitle-grey-color)"}
								whiteSpace={"normal"}
							>
								<Typography
									component={"a"}
									fontFamily={"inherit"}
									fontWeight={"inherit"}
									fontSize={"inherit"}
									lineHeight={"inherit"}
									color={"inherit"}
									textTransform={"inherit"}
									sx={{ textDecoration: "underline", cursor: "pointer" }}
								>
									Reach out to support
								</Typography>{" "}
								- we're happy to assist you.
							</Typography>
						</Box>
					</Stack>
				</Box>
			</DashboardWrapper>
		</AppLayout>
	);
};
