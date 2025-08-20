import { Stack } from "@mui/material";
import { BaseAlertModalPropsType } from "../../../type/component.type";
import { BaseAlertModalWrapper } from "./styled";

export const BaseAlertModal: React.FC<BaseAlertModalPropsType> = ({
	icon,
	open,
	body,
	header,
	className,
	handleClose,
}) => {
	return (
		<BaseAlertModalWrapper
			open={open}
			onClose={handleClose}
			className={className}
		>
			{icon && icon}
			<Stack className="alert-modal-content">
				{header && header} {body && body}
			</Stack>
		</BaseAlertModalWrapper>
	);
};
