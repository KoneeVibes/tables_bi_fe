import { Box, Grid, Typography } from "@mui/material";
import { UpdateJobTitleFormWrapper } from "./styled";
import { BaseLegend } from "../../../component/form/legend/styled";
import { SignUpFormPropsType } from "../../../type/container.type";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseInput } from "../../../component/form/input/styled";
import { BaseLabel } from "../../../component/form/label/styled";

export const UpdateJobTitleForm: React.FC<SignUpFormPropsType> = ({ formDetails, setFormDetails }) => {
    const titles = ["Data Analyst", "Product Manager", "Marketing", "Engineering", "Executive", "Operations", "Business Owner", "Consultant", "HR (Human Resources)", "Customer Support", "Finance", "Music Artist"];

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormDetails(prev => ({
            ...prev,
            [name]: prev[name].includes(value)
                ? prev[name].filter((v: string) => v !== value)
                : [...prev[name], value]
        }));
    };

    return (
        <UpdateJobTitleFormWrapper>
            <Box>
                <BaseLegend>What’s Your Role?</BaseLegend>
                <Typography
                    variant="body1"
                    fontFamily={"Inter"}
                    fontWeight={400}
                    fontSize={"14px"}
                    lineHeight={"normal"}
                    color="var(--dark-color)"
                    whiteSpace={"normal"}
                    textAlign={"center"}
                    marginBlockStart={"calc(var(--basic-margin)/4)"}
                >
                    Select your roles to help us tailor the experience
                </Typography>
            </Box>
            <Grid
                container
                justifyContent={"space-between"}
                spacing={{ mobile: "calc(var(--flex-gap)/2)", laptop: "var(--flex-gap)" }}
            >
                {titles.map((title, index) => {
                    return (
                        <Grid
                            key={index}
                            flexGrow={1}
                            size={{ mobile: 12, miniTablet: 6 }}
                        >
                            <BaseFieldSet>
                                <BaseLabel
                                    sx={{
                                        display: "flex",
                                        gap: "calc(var(--flex-gap)/4)",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        marginBlock: "0",
                                        padding: "calc(var(--basic-padding)/2)",
                                        border: "1px solid var(--form-label-border-color)",
                                        borderRadius: "10px",
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        "&:hover": {
                                            border: "1px solid var(--primary-color)",
                                        }
                                    }}
                                >
                                    <Typography
                                        component={"span"}
                                        variant="subtitle1"
                                        fontFamily={"inherit"}
                                        fontWeight={"inherit"}
                                        fontSize={"inherit"}
                                        lineHeight={"normal"}
                                        color={"var(--dark-color)"}
                                        flex={1}
                                    >
                                        {title}
                                    </Typography>
                                    <BaseInput
                                        type="checkbox"
                                        name={"jobTitle"}
                                        inputProps={{
                                            checked: formDetails["jobTitle"].includes(title),
                                        }}
                                        onChange={handleCheckboxChange}
                                        value={title}
                                        sx={{
                                            padding: 0,
                                            border: "none",
                                            borderRadius: "unset"
                                        }}
                                    />
                                </BaseLabel>
                            </BaseFieldSet>
                        </Grid>
                    )
                })}
            </Grid>
        </UpdateJobTitleFormWrapper>
    )
}