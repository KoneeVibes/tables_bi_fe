import React, { useEffect } from "react";
import { AppLayoutWrapper } from "./styled";
import avatar from "../../../asset/image/avatar.png";
import { SideNavigation } from "../../navigation/sidenavigation";
import { AppLayoutPropsType } from "../../../type/container.type";
import { TopNavigation } from "../../navigation/topnavigation";
import { MainArea } from "../../mainarea";
import { signOutUser } from "../../../util/authentication/signOut";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

export const AppLayout: React.FC<AppLayoutPropsType> = ({
	pageId,
	pageTitle,
	children,
}) => {
	const cookies = new Cookies();
	const TOKEN = cookies.getAll().TOKEN;

	const navigate = useNavigate();

	useEffect(() => {
		if (!pageId) return;
		document.body.id = pageId;
		return () => {
			document.body.removeAttribute("id");
		};
	}, [pageId]);

	const handleLogoutUser = async (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault();
		try {
			const response = await signOutUser(TOKEN);
			if (response.status === "success") {
				cookies.remove("TOKEN", { path: "/" });
			} else {
				console.error("Logout failed. Try again");
			}
		} catch (error: any) {
			console.error("Logout failed, Contact Admin:", error);
		} finally {
			navigate("/", { replace: true });
		}
	};

	return (
		<AppLayoutWrapper id={pageId} maxWidth={false}>
			<SideNavigation
				username="Barbara Ani"
				email="neilsonmike14@gmail.com"
				avatar={avatar}
				logoutUser={handleLogoutUser}
			/>
			<TopNavigation
				username="Barbara Ani"
				email="neilsonmike14@gmail.com"
				avatar={avatar}
				pageTitle={pageTitle}
				logoutUser={handleLogoutUser}
			/>
			<MainArea>{children}</MainArea>
		</AppLayoutWrapper>
	);
};
