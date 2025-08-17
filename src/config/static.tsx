import {
	SideNavigationConnectionIcon,
	SideNavigationDashboardIcon,
	SideNavigationSavedViewIcon,
	SideNavigationSettingIcon,
	UserMenuHelpIcon,
	UserMenuNotificationIcon,
	UserMenuProfileIcon,
	UserMenuSettingIcon,
} from "../asset";

export const sideNavigationItems = [
	{
		name: "Dashboard",
		icon: <SideNavigationDashboardIcon />,
		url: "/dashboard",
	},
	{
		name: "Connections",
		icon: <SideNavigationConnectionIcon />,
		url: "/connection",
	},
	{
		name: "Saved View",
		icon: <SideNavigationSavedViewIcon />,
		url: "/saved-view",
	},
	{
		name: "Settings",
		icon: <SideNavigationSettingIcon />,
		url: "/setting",
	},
];

export const userMenuItems = [
	{
		id: 0,
		title: "Profile",
		icon: <UserMenuProfileIcon />,
		url: "/setting",
	},
	{
		id: 1,
		title: "Notification",
		icon: <UserMenuNotificationIcon />,
		url: "/",
	},
	{
		id: 2,
		title: "Settings",
		icon: <UserMenuSettingIcon />,
		url: "/setting",
	},
	{
		id: 3,
		title: "Help",
		icon: <UserMenuHelpIcon />,
		url: "/",
	},
];
