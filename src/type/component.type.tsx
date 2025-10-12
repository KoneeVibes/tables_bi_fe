import { FormLabelProps, InputBaseProps } from "@mui/material";

export type BaseTypographyType = {
	fontsize?: string;
	fontweight?: number;
	colour?: string;
};

export type BaseButtonPropsType = BaseTypographyType & {
	radius?: string;
	padding?: string;
	bgcolor?: string;
	border?: string;
};

export type BaseLabelPropsType = BaseTypographyType & FormLabelProps;

export type BaseInputPropsType = BaseTypographyType & {
	border?: string;
	radius?: string;
	bgcolor?: string;
	padding?: string;
} & InputBaseProps;

export type BaseDropDownType = {
	id?: string | number;
	title: string;
	icon?: React.ReactNode;
	url?: string;
};

export type ModalPropsType = {
	open: boolean;
	handleClose:
		| ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
		| undefined;
	className?: string;
};

export type BaseDropDownModalPropsType = {
	items: BaseDropDownType[];
	handleItemClick: (
		e: React.MouseEvent<HTMLLIElement, MouseEvent>,
		item: BaseDropDownType
	) => void;
	header?: React.ReactNode;
	footer?: React.ReactNode;
} & ModalPropsType;

export type BaseAlertModalPropsType = {
	icon?: React.ReactNode;
	body?: React.ReactNode;
	header?: React.ReactNode;
} & ModalPropsType;

export type BaseTablePropsType = {
	headers: string[];
	rows: Record<any, any>[];
	selectedRows?: any[];
	children: React.ReactNode;
	containsCheckbox?: boolean;
	onSelectAllRowClick?: (
		event: React.ChangeEvent<HTMLInputElement>,
		checked: boolean
	) => void;
};
