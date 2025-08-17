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
	bgcolor?: string;
} & InputBaseProps;

export type BaseDropDownType = {
	id?: string | number;
	title: string;
	icon?: React.ReactNode;
	url?: string;
};

export type BaseDropDownPropsType = {
	open: boolean;
	handleClose:
		| ((event: {}, reason: "backdropClick" | "escapeKeyDown") => void)
		| undefined;
	items: BaseDropDownType[];
	handleItemClick: (
		e: React.MouseEvent<HTMLLIElement, MouseEvent>,
		item: BaseDropDownType
	) => void;
	header?: React.ReactNode;
	footer?: React.ReactNode;
	className?: string;
};
