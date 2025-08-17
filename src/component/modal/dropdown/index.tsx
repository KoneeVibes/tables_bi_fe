import { BaseDropDownWrapper } from "./styled";
import { Box, MenuItem, Typography } from "@mui/material";
import { BaseDropDownPropsType } from "../../../type/component.type";

export const BaseDropDown: React.FC<BaseDropDownPropsType> = ({
	open,
	items,
	header,
	footer,
	className,
	handleClose,
	handleItemClick,
}) => {
	return (
		<BaseDropDownWrapper
			open={open}
			onClose={handleClose}
			className={className}
		>
			{header}
			<ul>
				{items?.map((item, index) => {
					return (
						<MenuItem key={index} onClick={(e) => handleItemClick(e, item)}>
							{item.icon && (
								<Box component={"div"} className="menu-icon-box">
									{item.icon}
								</Box>
							)}
							<Box component={"div"} className="menu-text-box">
								<Typography
									variant="subtitle1"
									fontFamily={"Inter"}
									fontWeight={400}
									fontSize={"12px"}
									lineHeight={"normal"}
									color={"var(--form-header-color)"}
									whiteSpace={"normal"}
								>
									{item.title}
								</Typography>
							</Box>
						</MenuItem>
					);
				})}
			</ul>
			{footer}
		</BaseDropDownWrapper>
	);
};
