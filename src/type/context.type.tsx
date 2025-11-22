export type ContextProviderPropsType = {
	children: React.ReactNode;
};

export type AppContextType = {
	isMobileSideNavigationOpen: boolean;
	setIsMobileSideNavigationOpen: React.Dispatch<React.SetStateAction<boolean>>;
	isSideNavigationClosing: boolean;
	setIsSideNavigationClosing: React.Dispatch<React.SetStateAction<boolean>>;
	activeNavItem: string | null;
	setActiveNavItem: React.Dispatch<React.SetStateAction<string | null>>;
	signUpActiveTabIndex: number;
	setSignUpActiveTabIndex: React.Dispatch<React.SetStateAction<number>>;
	profileCompletionActiveTabIndex: number;
	setProfileCompletionActiveTabIndex: React.Dispatch<
		React.SetStateAction<number>
	>;
	joinTableCount: number;
	setJoinTableCount: React.Dispatch<React.SetStateAction<number>>;
	activeConnection: Record<string, any> | null;
	setActiveConnection: React.Dispatch<
		React.SetStateAction<Record<string, any> | null>
	>;
	signInActiveTabIndex: number;
	setSignInActiveTabIndex: React.Dispatch<React.SetStateAction<number>>;
};
