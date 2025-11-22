import { createContext, useState } from "react";
import { ContextProviderPropsType, AppContextType } from "../type/context.type";

export const AppContext = createContext({} as AppContextType);

export const AppContextProvider: React.FC<ContextProviderPropsType> = ({
	children,
}) => {
	const [signUpActiveTabIndex, setSignUpActiveTabIndex] = useState(0);
	const [signInActiveTabIndex, setSignInActiveTabIndex] = useState(0);
	const [isSideNavigationClosing, setIsSideNavigationClosing] = useState(false);
	const [activeNavItem, setActiveNavItem] = useState<string | null>(null);
	const [isMobileSideNavigationOpen, setIsMobileSideNavigationOpen] =
		useState(false);
	const [profileCompletionActiveTabIndex, setProfileCompletionActiveTabIndex] =
		useState(0);
	const [joinTableCount, setJoinTableCount] = useState<number>(0);
	const [activeConnection, setActiveConnection] = useState<Record<
		string,
		any
	> | null>(null);

	return (
		<AppContext.Provider
			value={{
				isMobileSideNavigationOpen,
				setIsMobileSideNavigationOpen,
				isSideNavigationClosing,
				setIsSideNavigationClosing,
				activeNavItem,
				setActiveNavItem,
				signUpActiveTabIndex,
				setSignUpActiveTabIndex,
				profileCompletionActiveTabIndex,
				setProfileCompletionActiveTabIndex,
				joinTableCount,
				setJoinTableCount,
				activeConnection,
				setActiveConnection,
				signInActiveTabIndex,
				setSignInActiveTabIndex,
			}}
		>
			{children}
		</AppContext.Provider>
	);
};
