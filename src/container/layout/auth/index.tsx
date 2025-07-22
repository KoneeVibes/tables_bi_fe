import { Box, Stack, Typography } from "@mui/material";
import { AuthLayoutWrapper } from "./styled";
import { AuthLayoutPropsType } from "../../../type/container.type";
import logo from "../../../asset/icon/logo-on-dark-bg.svg";
import thumbnail from "../../../asset/image/auth-thumbnail.svg";

export const AuthLayout: React.FC<AuthLayoutPropsType> = ({ children }) => {
    return (
        <AuthLayoutWrapper>
            <Box
                component={"div"}
                className="image-box"
            >
                <Stack
                    component={"div"}
                    className="image-box-inner"
                >
                    <Box>
                        <img
                            src={logo}
                            alt="application logo"
                        />
                    </Box>
                    <Box>
                        <Typography
                            variant="h1"
                            fontFamily={"Inter"}
                            fontWeight={700}
                            fontSize={24}
                            lineHeight={"normal"}
                            color="var(--light-color)"
                            whiteSpace={"normal"}
                            marginBlockEnd={"calc(var(--basic-margin)/4)"}
                        >
                            Elevate your business decisions with TablesBI
                        </Typography>
                        <Typography
                            variant="body1"
                            fontFamily={"Inter"}
                            fontWeight={500}
                            fontSize={14}
                            lineHeight={"normal"}
                            color="var(--light-color)"
                            whiteSpace={"normal"}
                        >
                            Our no-code business intelligence platform connects directly to your database and turns raw tables into insights. With intuitive filters, joins, and visualizations, TablesBI makes data exploration accessible to everyone on your team—no SQL required.
                        </Typography>
                    </Box>
                    <Box
                        component={"div"}
                        className="auth-thumbnail"
                    >
                        <img
                            src={thumbnail}
                            alt="authentication page thumbnail"
                        />
                    </Box>
                </Stack>
            </Box>
            <Box
                component={"div"}
                className="form-box"
            >
                {children}
            </Box>
        </AuthLayoutWrapper>
    )
};
