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

export type DatasourceSwitchTablePropsType = {
	tables: Record<string, any>[];
} & BaseFormPropsType;

export type SelectedDbTableFieldsPropsType = {
	fields: Record<string, any>[];
} & BaseFormPropsType;

export type ConnectedTablePropsType = {
	tableName: string;
	fieldName: string;
	fields: Record<string, any>[];
	tables: Record<string, any>[];
	setTableRelationship: React.Dispatch<
		React.SetStateAction<Record<string, any> | null>
	>;
} & BaseFormPropsType;

export type BaseTablePropsType = {
	rows: Record<any, any>[];
};

export type QueryResultTablePropsType = {
	headers: string[];
	selectedRows: any[];
	handleCheckRow: (
		event: React.ChangeEvent<HTMLInputElement>,
		index: number
	) => void;
	handleCheckAllRow: (
		event: React.ChangeEvent<HTMLInputElement>,
		checked: boolean
	) => void;
} & BaseTablePropsType;

export type SaveQueryFormPropsType = {
	isOpen: boolean;
	queryName: string;
	isLoading: boolean;
	error: string | null;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setQueryName: React.Dispatch<React.SetStateAction<string>>;
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};
