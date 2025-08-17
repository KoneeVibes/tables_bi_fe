import {
	Box,
	Drawer,
	IconButton,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Stack,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../../context/appContext";
import { sideNavigationItems } from "../../../config/static";
import { useNavigate } from "react-router-dom";
import logo from "../../../asset/logo.png";
import { Close } from "@mui/icons-material";
import { NavigationPropsType } from "../../../type/container.type";
import clipboardIcon from "../../../asset/icon/copy-to-clipboard-icon.svg";
import { SideNavigationLogoutIcon } from "../../../asset";

export const SideNavigation: React.FC<NavigationPropsType> = ({
	avatar,
	username,
	email,
	logoutUser,
}) => {
	const navigate = useNavigate();
	const {
		setIsSideNavigationClosing,
		isMobileSideNavigationOpen,
		setIsMobileSideNavigationOpen,
	} = useContext(AppContext);
	const matchesMobileAndAbove = useMediaQuery("(min-width:425px)");

	const handleDrawerClose = () => {
		setIsSideNavigationClosing(true);
		setIsMobileSideNavigationOpen(false);
	};

	const handleDrawerTransitionEnd = () => {
		setIsSideNavigationClosing(false);
	};

	const handleNavItemClick = (
		e: React.MouseEvent<HTMLDivElement, MouseEvent>,
		item: string
	) => {
		e.stopPropagation();
		navigate(item);
		return setIsMobileSideNavigationOpen(false);
	};

	const navItems = sideNavigationItems.map((sideNavItem, index) => {
		return (
			<ListItem
				key={index}
				className={`${sideNavItem.name.replace(
					/\s+/g,
					"-"
				)}-Side-Nav-Item Side-Nav-Item`}
				component={"div"}
				sx={{
					flexDirection: "column",
					alignItems: "stretch",
					padding: "calc(var(--basic-padding)/4) calc(var(--basic-padding)/2)",
					marginTop: index === 0 ? "calc(var(--basic-margin)/2)" : "0",
				}}
				onClick={(e) => handleNavItemClick(e, sideNavItem.url)}
			>
				<ListItemButton>
					<ListItemIcon>{sideNavItem.icon}</ListItemIcon>
					<ListItemText primary={sideNavItem.name} />
				</ListItemButton>
			</ListItem>
		);
	});

	return (
		<Box>
			<Drawer
				variant="temporary"
				open={isMobileSideNavigationOpen}
				onTransitionEnd={handleDrawerTransitionEnd}
				onClose={handleDrawerClose}
				ModalProps={{
					keepMounted: true,
				}}
				sx={{
					display: { mobile: "block", tablet: "none" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: "var(--side-nav-width)",
						backgroundColor: "var(--side-nav-off-white-bg-color)",
						borderRight: "1px solid var(--border-color)",
					},
				}}
			>
				<ListItem className="side-navigation-header">
					<ListItemIcon className="app-icon">
						<img src={logo} alt="tables-bi-logo" className="tables-bi-logo" />
					</ListItemIcon>
					<Box component={"div"} className="close-button">
						<IconButton
							sx={{
								borderRadius: "6px",
								color: "var(--light-color)",
								padding: "calc(var(--basic-padding)/8)",
								backgroundColor: "var(--primary-color)",
								display: matchesMobileAndAbove ? "none" : "inline-flex",
							}}
							onClick={handleDrawerClose}
						>
							<Close />
						</IconButton>
					</Box>
				</ListItem>
				{navItems}
				<Box marginTop={"auto"} padding={"var(--basic-padding)"}>
					<Stack
						overflow={"hidden"}
						flexDirection={"row"}
						borderRadius={"10px"}
						bgcolor={"var(--light-color)"}
						gap={"calc(var(--flex-gap)/2)"}
						padding={"calc(var(--basic-padding)/2)"}
						border={"1px solid var(--border-color)"}
					>
						<Box overflow={"hidden"} display={"flex"} flex={"0 1 50px"}>
							<img
								src={avatar}
								alt="user-avatar"
								className="user-avatar"
								style={{
									width: "100%",
									height: "100%",
									objectFit: "fill",
									borderRadius: "10px",
								}}
							/>
						</Box>
						<Stack
							sx={{
								flex: "1 1 auto",
								overflow: "hidden",
								gap: "calc(var(--flex-gap)/4)",
							}}
						>
							<Box overflow={"hidden"}>
								<Typography
									variant="subtitle1"
									fontFamily={"Inter"}
									fontWeight={500}
									fontSize={14}
									lineHeight={"normal"}
									color={"var(--subtitle-dark-color)"}
								>
									{username}
								</Typography>
							</Box>
							<Stack
								direction={"row"}
								alignItems={"center"}
								gap={"calc(var(--flex-gap)/2)"}
								overflow={"hidden"}
							>
								<Box flexShrink={1} overflow={"hidden"}>
									<Typography
										variant="subtitle2"
										fontFamily={"Inter"}
										fontWeight={400}
										fontSize={12}
										lineHeight={"normal"}
										color={"var(--form-label-color)"}
									>
										{email}
									</Typography>
								</Box>
								<Box display={"flex"} flexShrink={0}>
									<img
										src={clipboardIcon}
										alt="copy-to-clipboard-icon"
										style={{ cursor: "pointer" }}
									/>
								</Box>
							</Stack>
						</Stack>
						<Box display={"flex"} justifyContent={"center"} flex={"0 0 auto"}>
							<IconButton
								sx={{
									borderRadius: "10px",
								}}
								onClick={logoutUser}
							>
								<SideNavigationLogoutIcon />
							</IconButton>
						</Box>
					</Stack>
				</Box>
			</Drawer>
			<Drawer
				variant="permanent"
				sx={{
					display: { mobile: "none", tablet: "block" },
					"& .MuiDrawer-paper": {
						boxSizing: "border-box",
						width: "var(--side-nav-width)",
						backgroundColor: "var(--side-nav-off-white-bg-color)",
						borderRight: "1px solid var(--border-color)",
					},
				}}
				open
			>
				<ListItem className="side-navigation-header">
					<ListItemIcon className="app-icon">
						<img src={logo} alt="tables-bi-logo" className="tables-bi-logo" />
					</ListItemIcon>
				</ListItem>
				{navItems}
				<Box marginTop={"auto"} padding={"var(--basic-padding)"}>
					<Stack
						overflow={"hidden"}
						flexDirection={"row"}
						borderRadius={"10px"}
						bgcolor={"var(--light-color)"}
						gap={"calc(var(--flex-gap)/2)"}
						padding={"calc(var(--basic-padding)/2)"}
						border={"1px solid var(--border-color)"}
					>
						<Box overflow={"hidden"} display={"flex"} flex={"0 1 50px"}>
							<img
								src={avatar}
								alt="user-avatar"
								className="user-avatar"
								style={{
									width: "100%",
									height: "100%",
									objectFit: "fill",
									borderRadius: "10px",
								}}
							/>
						</Box>
						<Stack
							sx={{
								flex: "1 1 auto",
								overflow: "hidden",
								gap: "calc(var(--flex-gap)/4)",
							}}
						>
							<Box overflow={"hidden"}>
								<Typography
									variant="subtitle1"
									fontFamily={"Inter"}
									fontWeight={500}
									fontSize={14}
									lineHeight={"normal"}
									color={"var(--subtitle-dark-color)"}
								>
									{username}
								</Typography>
							</Box>
							<Stack
								direction={"row"}
								alignItems={"center"}
								gap={"calc(var(--flex-gap)/2)"}
								overflow={"hidden"}
							>
								<Box flexShrink={1} overflow={"hidden"}>
									<Typography
										variant="subtitle2"
										fontFamily={"Inter"}
										fontWeight={400}
										fontSize={12}
										lineHeight={"normal"}
										color={"var(--form-label-color)"}
									>
										{email}
									</Typography>
								</Box>
								<Box display={"flex"} flexShrink={0}>
									<img
										src={clipboardIcon}
										alt="copy-to-clipboard-icon"
										style={{ cursor: "pointer" }}
									/>
								</Box>
							</Stack>
						</Stack>
						<Box display={"flex"} justifyContent={"center"} flex={"0 0 auto"}>
							<IconButton
								sx={{
									borderRadius: "10px",
								}}
								onClick={logoutUser}
							>
								<SideNavigationLogoutIcon />
							</IconButton>
						</Box>
					</Stack>
				</Box>
			</Drawer>
		</Box>
	);
};
