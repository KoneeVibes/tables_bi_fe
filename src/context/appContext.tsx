import { createContext, useState } from "react";
import { ContextProviderPropsType, AppContextType } from "../type/context.type";

export const AppContext = createContext({} as AppContextType);

export const AppContextProvider: React.FC<ContextProviderPropsType> = ({ children }) => {
    const [signUpActiveTabIndex, setSignUpActiveTabIndex] = useState(0);
    const [isSideNavigationClosing, setIsSideNavigationClosing] = useState(false);
    const [activeNavItem, setActiveNavItem] = useState<string | undefined>(undefined);
    const [isMobileSideNavigationOpen, setIsMobileSideNavigationOpen] = useState(false);

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
                setSignUpActiveTabIndex
            }}
        >
            {children}
        </AppContext.Provider>
    )
}