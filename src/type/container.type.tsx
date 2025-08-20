export type AuthLayoutPropsType = {
	children: React.ReactNode;
};

export type AppLayoutPropsType = {
	pageId: string;
	pageTitle: string;
	children: React.ReactNode;
};

export type BaseFormPropsType = {
	error?: string | null;
	setError?: React.Dispatch<React.SetStateAction<string | null>>;
	formDetails: Record<string, any>;
	setFormDetails: React.Dispatch<React.SetStateAction<Record<string, any>>>;
};

export type NavigationPropsType = {
	email: string;
	avatar: string;
	username: string;
	logoutUser: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};

export type TopNavigationPropsType = {
	pageTitle: string;
} & NavigationPropsType;

export type MainAreaPropsType = {
	children: React.ReactNode;
};
