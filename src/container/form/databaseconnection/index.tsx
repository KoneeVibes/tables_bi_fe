import { Box, Grid, Typography } from "@mui/material";
import { DatabaseConnectionFormWrapper } from "./styled";
import { BaseLegend } from "../../../component/form/legend/styled";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseLabel } from "../../../component/form/label/styled";
import { BaseInput } from "../../../component/form/input/styled";
import { BaseFormPropsType } from "../../../type/container.type";

export const DatabaseConnectionForm: React.FC<BaseFormPropsType> = ({
	formDetails,
	setFormDetails,
}) => {
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormDetails((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<DatabaseConnectionFormWrapper>
			<Box>
				<BaseLegend>Link your PostgreSQL database</BaseLegend>
				<Typography
					variant="body1"
					fontFamily={"Inter"}
					fontWeight={500}
					fontSize={"14px"}
					lineHeight={"normal"}
					color="var(--subtitle-grey-color)"
					whiteSpace={"normal"}
					marginBlockStart={"calc(var(--basic-margin)/4)"}
				>
					TablesBI ensures secure, read-only access and does not retain copies
					of your data. We prioritize your data's security.
				</Typography>
			</Box>
			<Grid container spacing={"var(--flex-gap)"}>
				<Grid size={{ mobile: 12 }}>
					<BaseFieldSet>
						<BaseLabel>Host URL</BaseLabel>
						<BaseInput
							required
							name="hostURL"
							value={formDetails.hostURL}
							placeholder="Enter Host URL"
							onChange={(e) => handleChange(e)}
						/>
					</BaseFieldSet>
				</Grid>
				<Grid size={{ mobile: 12 }}>
					<BaseFieldSet>
						<BaseLabel>Connection Port</BaseLabel>
						<BaseInput
							required
							name="port"
							value={formDetails.port}
							placeholder="Enter Connection Port"
							onChange={(e) => handleChange(e)}
						/>
					</BaseFieldSet>
				</Grid>
				<Grid size={{ mobile: 12 }}>
					<BaseFieldSet>
						<BaseLabel>Username</BaseLabel>
						<BaseInput
							required
							name="username"
							value={formDetails.username}
							placeholder="Enter Username"
							onChange={(e) => handleChange(e)}
						/>
					</BaseFieldSet>
				</Grid>
				<Grid size={{ mobile: 12 }}>
					<BaseFieldSet>
						<BaseLabel>Password</BaseLabel>
						<BaseInput
							required
							name="password"
							type="password"
							value={formDetails.password}
							placeholder="Enter Password"
							onChange={(e) => handleChange(e)}
						/>
					</BaseFieldSet>
				</Grid>
				<Grid size={{ mobile: 12 }}>
					<BaseFieldSet>
						<BaseLabel>Database Name</BaseLabel>
						<BaseInput
							required
							name="dbName"
							value={formDetails.dbName}
							placeholder="Enter Database Name"
							onChange={(e) => handleChange(e)}
						/>
					</BaseFieldSet>
				</Grid>
			</Grid>
		</DatabaseConnectionFormWrapper>
	);
};
