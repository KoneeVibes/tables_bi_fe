import {
	Box,
	DialogContent,
	DialogTitle,
	IconButton,
	Stack,
	useMediaQuery,
} from "@mui/material";
import { BaseFormModalWrapper } from "./styled";
import { FormModalPropsType } from "../../../type/component.type";
import CloseIcon from "@mui/icons-material/Close";

export const BaseFormModal: React.FC<FormModalPropsType> = ({
	open,
	className,
	handleClickOutside,
	title,
	handleSubmit,
	children,
}) => {
	const matches = useMediaQuery("(max-width:200px)");
	return (
		<BaseFormModalWrapper
			open={open}
			className={className}
			onClose={handleClickOutside}
			slotProps={{
				paper: {
					component: "form",
					onSubmit: handleSubmit,
				},
			}}
		>
			<Stack className="title-bar">
				<Box overflow={"hidden"}>
					<DialogTitle component={"legend"}>{title}</DialogTitle>
				</Box>
				<Box overflow={"hidden"} flexShrink={matches ? 1 : 0}>
					<IconButton
						sx={{
							borderRadius: "8px",
							padding: "calc(var(--basic-padding)/4)",
							backgroundColor: "var(--icon-button-bg-color)",
						}}
						onClick={(e) => handleClickOutside?.(e, "backdropClick")}
					>
						<CloseIcon sx={{ color: "var(--form-header-color)" }} />
					</IconButton>
				</Box>
			</Stack>
			<DialogContent>{children}</DialogContent>
		</BaseFormModalWrapper>
	);
};
