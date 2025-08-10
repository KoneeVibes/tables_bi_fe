export type ContextProviderPropsType = {
    children: React.ReactNode
};

export type AppContextType = {
    isMobileSideNavigationOpen: boolean
    setIsMobileSideNavigationOpen: React.Dispatch<React.SetStateAction<boolean>>
    isSideNavigationClosing: boolean
    setIsSideNavigationClosing: React.Dispatch<React.SetStateAction<boolean>>
    activeNavItem: string | undefined
    setActiveNavItem: React.Dispatch<React.SetStateAction<string | undefined>>
    signUpActiveTabIndex: number
    setSignUpActiveTabIndex: React.Dispatch<React.SetStateAction<number>>
    profileCompletionActiveTabIndex: number
    setProfileCompletionActiveTabIndex: React.Dispatch<React.SetStateAction<number>>
};
