import { MainAreaPropsType } from "../../type/container.type";
import { MainAreaWrapper } from "./styled";

export const MainArea: React.FC<MainAreaPropsType> = ({ children }) => {
	return <MainAreaWrapper>{children}</MainAreaWrapper>;
};
