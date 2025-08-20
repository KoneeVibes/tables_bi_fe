import { useContext, useState } from "react";
import {
	Avatar,
	Box,
	IconButton,
	Stack,
	Toolbar,
	Typography,
} from "@mui/material";
import { TopNavigationPropsType } from "../../../type/container.type";
import { TopNavigationWrapper } from "./styled";
import { AppContext } from "../../../context/appContext";
import MenuIcon from "@mui/icons-material/Menu";
import clipboardIcon from "../../../asset/icon/copy-to-clipboard-icon.svg";
import { BaseDropDownModal } from "../../../component/modal/dropdown";
import { BaseDropDownType } from "../../../type/component.type";
import { BaseButton } from "../../../component/button/styled";
import {
	TopNavigationNotificationIcon,
	UserMenuLogoutIcon,
} from "../../../asset";
import { userMenuItems } from "../../../config/static";
import { useNavigate } from "react-router-dom";

export const TopNavigation: React.FC<TopNavigationPropsType> = ({
	username,
	email,
	avatar,
	pageTitle,
	logoutUser,
}) => {
	const {
		isSideNavigationClosing,
		isMobileSideNavigationOpen,
		setIsMobileSideNavigationOpen,
	} = useContext(AppContext);
	const navigate = useNavigate();

	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

	const handleOpenNotification = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
	};

	const handleDrawerToggle = () => {
		if (!isSideNavigationClosing) {
			setIsMobileSideNavigationOpen(!isMobileSideNavigationOpen);
		}
	};

	const handleOpenUserMenu = (
		e: React.MouseEvent<HTMLImageElement, MouseEvent>
	) => {
		e.preventDefault();
		return setIsUserMenuOpen(true);
	};

	const handleCloseUserMenu = () => {
		return setIsUserMenuOpen(false);
	};

	const handleUserMenuItemClick = (
		e: React.MouseEvent<HTMLLIElement, MouseEvent>,
		item: BaseDropDownType
	) => {
		e.preventDefault();
		switch (item.id) {
			case 0:
			case 2:
				navigate(item.url as string);
				break;
			default:
				handleCloseUserMenu();
				break;
		}
	};

	const getUserInitials = (fullName: string) => {
		if (!fullName) return "";

		const parts = fullName.trim().split(/\s+/);
		if (parts.length < 2) return parts[0][0].toUpperCase();

		const first = parts[0][0].toUpperCase();
		const last = parts[parts.length - 1][0].toUpperCase();

		return first + last;
	};

	const userMenuHeader = (
		<Stack
			direction={"row"}
			gap={"calc(var(--flex-gap)/2)"}
			padding={"calc(var(--basic-padding) * 0.75)"}
			borderBottom={"1px solid var(--form-label-border-color)"}
		>
			<Avatar sx={{ background: "var(--primary-color)" }}>
				{getUserInitials(username)}
			</Avatar>
			<Stack>
				<Box>
					<Typography
						variant="subtitle1"
						fontFamily={"Inter"}
						fontWeight={600}
						fontSize={14}
						lineHeight={"normal"}
						color={"var(--form-header-color)"}
					>
						{username}
					</Typography>
				</Box>
				<Box>
					<Typography
						variant="subtitle2"
						fontFamily={"Inter"}
						fontWeight={400}
						fontSize={12}
						lineHeight={"normal"}
						color={"var(--form-label-color)"}
					>
						Online
					</Typography>
				</Box>
			</Stack>
		</Stack>
	);

	const userMenuFooter = (
		<Box
			padding={"calc(var(--basic-padding)/4)"}
			borderTop={"1px solid var(--form-label-border-color)"}
		>
			<BaseButton
				border="none"
				disableElevation
				startIcon={<UserMenuLogoutIcon />}
				padding={"calc(var(--basic-padding)/2)"}
				sx={{
					width: "100%",
					justifyContent: "flex-start",
					"& .MuiButton-startIcon": {
						marginLeft: "unset",
						marginRight: "calc(var(--flex-gap)/2)",
					},
				}}
				onClick={logoutUser}
			>
				<Typography
					variant={"button"}
					fontFamily={"inherit"}
					fontWeight={400}
					fontSize={"12px"}
					lineHeight={"normal"}
					color={"var(--error-red-color)"}
					whiteSpace={"normal"}
					textTransform={"inherit"}
				>
					Log Out
				</Typography>
			</BaseButton>
		</Box>
	);

	return (
		<TopNavigationWrapper>
			<Toolbar>
				<Box component={"div"} className="top-navigation-LHS">
					<Typography
						variant="h1"
						fontFamily={"Inter"}
						fontWeight={700}
						fontSize={20}
						lineHeight={"normal"}
						color={"var(--form-header-color)"}
					>
						{pageTitle}
					</Typography>
				</Box>
				<Stack className="top-navigation-MS">
					<Box component={"div"} className="notification-button-box">
						<IconButton
							sx={{
								color: "var(--light-color)",
								border: "1px solid var(--border-color)",
								borderRadius: "10px",
							}}
							onClick={handleOpenNotification}
						>
							<TopNavigationNotificationIcon />
						</IconButton>
					</Box>
					<Stack className="logged-in-user-information-stack">
						<Box component={"div"} className="user-avatar-box">
							<img
								src={avatar}
								alt="user-avatar"
								className="user-avatar"
								onClick={handleOpenUserMenu}
							/>
						</Box>
						<Stack className="username-and-email-stack">
							<Box component={"div"} className="username-area">
								<Typography
									variant="subtitle1"
									fontFamily={"Inter"}
									fontWeight={600}
									fontSize={14}
									lineHeight={"normal"}
									color={"var(--form-header-color)"}
									maxWidth={"7.25rem"}
									marginBlockEnd={"calc(var(--basic-margin)/8)"}
								>
									{username}
								</Typography>
							</Box>
							<Stack className="useremail-area">
								<Box component={"div"} className="email-box">
									<Typography
										variant="subtitle2"
										fontFamily={"Inter"}
										fontWeight={400}
										fontSize={12}
										lineHeight={"normal"}
										maxWidth={"7.25rem"}
										color={"var(--form-label-color)"}
									>
										{email}
									</Typography>
								</Box>
								<Box component={"div"} className="clipboard-icon-box">
									<img
										src={clipboardIcon}
										alt="copy-to-clipboard-icon"
										className="clipboard-icon"
									/>
								</Box>
							</Stack>
						</Stack>
						<BaseDropDownModal
							items={userMenuItems}
							open={isUserMenuOpen}
							header={userMenuHeader}
							footer={userMenuFooter}
							handleClose={handleCloseUserMenu}
							handleItemClick={handleUserMenuItemClick}
							className="top-navigation-user-menu-dropdown"
						/>
					</Stack>
				</Stack>
				<Box component={"div"} className="top-navigation-RHS">
					<IconButton
						size="large"
						color="inherit"
						aria-label="menu"
						sx={{
							borderRadius: "6px",
							color: "var(--light-color)",
							padding: "calc(var(--basic-padding)/8)",
							backgroundColor: "var(--primary-color)",
						}}
						onClick={handleDrawerToggle}
					>
						<MenuIcon />
					</IconButton>
				</Box>
			</Toolbar>
		</TopNavigationWrapper>
	);
};
