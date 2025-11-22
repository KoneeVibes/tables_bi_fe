export type AuthLayoutPropsType = {
	children: React.ReactNode;
};

export type AppLayoutPropsType = {
	pageId: string;
	pageTitle: string;
	children: React.ReactNode;
};

export type BaseFormPropsType<T = Record<string, any>> = {
	error?: string | null;
	setError?: React.Dispatch<React.SetStateAction<string | null>>;
	formDetails: T;
	setFormDetails: React.Dispatch<React.SetStateAction<T>>;
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

export type DatabaseConnectionFormPropsType = {
	dbType: string;
} & BaseFormPropsType;

export type DatasourceSwitchTablePropsType = {
	tables: Record<string, any>[];
	dbList: Record<string, any>[];
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

export type QueryResultFilterPropsType = {
	fields: string[];
	handleSorting: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
	handleFiltering: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
} & BaseFormPropsType<ResultFilter>;

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

export type EmailVerificationFormPropsType = {
	navigateBack: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
} & BaseFormPropsType;

export type SortItem = { field: string; value: string };
export type FilterItem = { field: string; criteria: string; value: string };
export type ResultFilter = { sort: SortItem[]; filter: FilterItem[] };
