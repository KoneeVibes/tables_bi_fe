import {
	DatabaseIcon,
	DeleteIcon,
	SideNavigationConnectionIcon,
	SideNavigationDashboardIcon,
	SideNavigationSavedViewIcon,
	SideNavigationSettingIcon,
	UserMenuHelpIcon,
	UserMenuNotificationIcon,
	UserMenuProfileIcon,
	UserMenuSettingIcon,
	VisibleIcon,
} from "../asset";
import encryptionIcon from "../asset/icon/encryption-icon.svg";
import timeIcon from "../asset/icon/time-icon.svg";
import dbIcon from "../asset/icon/red-db-icon.svg";
import helpIcon from "../asset/icon/help-icon.svg";
import mySQLIcon from "../asset/icon/my-sql-icon.svg";
import postgreSQLIcon from "../asset/icon/postgres-sql-icon.svg";
import sqlServerIcon from "../asset/icon/sql-server-icon.svg";
import otherDBIcon from "../asset/icon/other-db-icon.svg";

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

export const coreFeatures = [
	{ icon: encryptionIcon, description: "Encrypted & secure by default" },
	{ icon: timeIcon, description: "Get set up in under 2 minutes" },
	{ icon: dbIcon, description: "Auto-detects tables and relationships" },
	{ icon: helpIcon, description: "Real-time support if you need help" },
];

export const supportedDataSources = [
	{ icon: mySQLIcon, name: "MySQL" },
	{ icon: postgreSQLIcon, name: "PostgreSQL" },
	{ icon: sqlServerIcon, name: "SQL-Server" },
	{ icon: otherDBIcon, name: "Others" },
];

export const queryMenuItems = [
	{
		id: 0,
		title: "View Table",
		icon: <VisibleIcon />,
		url: "/saved-view",
	},
	{
		id: 1,
		title: "Export",
		icon: <DatabaseIcon />,
		url: "/export",
	},
	{
		id: 2,
		title: "Delete",
		icon: <DeleteIcon />,
		url: "/delete",
	},
];
