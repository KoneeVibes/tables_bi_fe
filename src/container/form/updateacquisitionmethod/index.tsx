import { Box, Grid, Typography } from "@mui/material";
import { UpdateAcquisitionMethodFormWrapper } from "./styled";
import { BaseLegend } from "../../../component/form/legend/styled";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseLabel } from "../../../component/form/label/styled";
import { BaseInput } from "../../../component/form/input/styled";
import { SignUpFormPropsType } from "../../../type/container.type";

export const UpdateAcquisitionMethodForm: React.FC<SignUpFormPropsType> = ({ formDetails, setFormDetails }) => {
    const methods = ["Twitter (X)", "LinkedIn", "Product Hunt", "Slack group", "Google Search", "From a colleague", "Youtube", "Other"];

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
        <UpdateAcquisitionMethodFormWrapper>
            <Box>
                <BaseLegend>
                    How did you hear about TablesBI?
                </BaseLegend>
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
                    Select one or more sources
                </Typography>
            </Box>
            <Grid
                container
                justifyContent={"space-between"}
                spacing={{ mobile: "calc(var(--flex-gap)/2)", laptop: "var(--flex-gap)" }}
            >
                {methods.map((method, index) => {
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
                                        {method}
                                    </Typography>
                                    <BaseInput
                                        type="checkbox"
                                        name={"acquisitionMethod"}
                                        inputProps={{
                                            checked: formDetails["acquisitionMethod"].includes(method),
                                        }}
                                        onChange={handleCheckboxChange}
                                        value={method}
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
        </UpdateAcquisitionMethodFormWrapper>
    )
}