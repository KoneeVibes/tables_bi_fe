import { Box, Grid, Stack, Typography } from "@mui/material";
import { SignUpFormWrapper } from "./styled";
import { BaseLegend } from "../../../component/form/legend/styled";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseLabel } from "../../../component/form/label/styled";
import { BaseInput } from "../../../component/form/input/styled";
import { SignUpFormPropsType } from "../../../type/container.type";
import logo from "../../../asset/icon/logo-on-light-bg.svg";
import { useContext } from "react";
import { AppContext } from "../../../context/appContext";
import { useNavigate } from "react-router-dom";

export const SignUpForm: React.FC<SignUpFormPropsType> = ({ formDetails, setFormDetails }) => {
    const {
        setSignUpActiveTabIndex
    } = useContext(AppContext);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormDetails((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNavigateToSignIn = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.preventDefault();
        navigate("/");
        return setSignUpActiveTabIndex(0);
    };

    return (
        <SignUpFormWrapper>
            <Stack
                className="logo-box"
            >
                <img
                    src={logo}
                    alt="application logo"
                />
            </Stack>
            <Box>
                <BaseLegend>Welcome to TablesBI</BaseLegend>
                <Typography
                    variant="body1"
                    fontFamily={"Inter"}
                    fontWeight={400}
                    fontSize={"14px"}
                    lineHeight={"normal"}
                    color="var(--dark-color)"
                    textAlign={"center"}
                    whiteSpace={"normal"}
                    marginBlockStart={"calc(var(--basic-margin)/4)"}
                >
                    Already have an account? <Typography
                        component={"span"}
                        fontFamily={"inherit"}
                        fontWeight={600}
                        fontSize={"inherit"}
                        lineHeight={"inherit"}
                        color="var(--primary-color)"
                        textAlign={"inherit"}
                        whiteSpace={"inherit"}
                        sx={{ cursor: "pointer" }}
                        onClick={handleNavigateToSignIn}
                    >
                        Log In
                    </Typography>
                </Typography>
            </Box>
            <Grid
                container
                spacing={"var(--flex-gap)"}
            >
                <Grid
                    size={{ mobile: 12, tablet: 6 }}
                >
                    <BaseFieldSet>
                        <BaseLabel>
                            First Name
                        </BaseLabel>
                        <BaseInput
                            required
                            name="firstName"
                            value={formDetails.firstName}
                            placeholder="Enter your first name"
                            onChange={(e) => handleChange(e)}
                        />
                    </BaseFieldSet>
                </Grid>
                <Grid
                    size={{ mobile: 12, tablet: 6 }}
                >
                    <BaseFieldSet>
                        <BaseLabel>
                            Last Name
                        </BaseLabel>
                        <BaseInput
                            required
                            name="lastName"
                            value={formDetails.lastName}
                            placeholder="Enter Last Name"
                            onChange={(e) => handleChange(e)}
                        />
                    </BaseFieldSet>
                </Grid>
                <Grid
                    size={{ mobile: 12 }}
                >
                    <BaseFieldSet>
                        <BaseLabel>
                            Email Address
                        </BaseLabel>
                        <BaseInput
                            required
                            type="email"
                            name="email"
                            value={formDetails.email}
                            placeholder="youremail@company.com"
                            onChange={(e) => handleChange(e)}
                        />
                    </BaseFieldSet>
                </Grid>
                <Grid
                    size={{ mobile: 12 }}
                >
                    <BaseFieldSet>
                        <BaseLabel>
                            Name of Organisation (Optional)
                        </BaseLabel>
                        <BaseInput
                            name="organization"
                            value={formDetails.organization}
                            placeholder="Enter the name of your organisation"
                            onChange={(e) => handleChange(e)}
                        />
                    </BaseFieldSet>
                </Grid>
                <Grid
                    size={{ mobile: 12 }}
                >
                    <BaseFieldSet>
                        <BaseLabel>
                            Password
                        </BaseLabel>
                        <BaseInput
                            required
                            type="password"
                            name="password"
                            value={formDetails.password}
                            placeholder="Enter password"
                            onChange={(e) => handleChange(e)}
                        />
                    </BaseFieldSet>
                </Grid>
                <Grid
                    size={{ mobile: 12 }}
                >
                    <BaseFieldSet>
                        <BaseLabel>
                            Confirm Password
                        </BaseLabel>
                        <BaseInput
                            required
                            type="password"
                            name="confirmPassword"
                            value={formDetails.confirmPassword}
                            placeholder="Confirm your password"
                            onChange={(e) => handleChange(e)}
                        />
                    </BaseFieldSet>
                </Grid>
            </Grid>
        </SignUpFormWrapper >
    )
}