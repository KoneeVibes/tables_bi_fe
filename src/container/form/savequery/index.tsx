import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { BaseFormModal } from "../../../component/modal/form";
import { SaveQueryFormWrapper } from "./styled";
import { SaveQueryFormPropsType } from "../../../type/container.type";
import { BaseFieldSet } from "../../../component/form/fieldset/styled";
import { BaseLabel } from "../../../component/form/label/styled";
import { BaseInput } from "../../../component/form/input/styled";
import { BaseButton } from "../../../component/button/styled";

export const SaveQueryForm: React.FC<SaveQueryFormPropsType> = ({
	isOpen,
	setIsOpen,
	isLoading,
	error,
	queryName,
	setQueryName,
	handleSubmit,
}) => {
	const handleClickOutside = () => {
		setIsOpen(false);
	};

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { value } = e.target;
		setQueryName(value);
	};

	return (
		<BaseFormModal
			open={isOpen}
			handleClickOutside={handleClickOutside}
			handleSubmit={handleSubmit}
			title="Save Query"
			className="save-query-form-modal"
		>
			<SaveQueryFormWrapper>
				<Stack overflow={"hidden"}>
					<Box component={"div"} className="save-query-hint">
						<Typography
							variant="body1"
							fontFamily={"Inter"}
							fontWeight={500}
							fontSize={"14px"}
							lineHeight={"normal"}
							whiteSpace={"normal"}
							color="var(--form-header-color)"
						>
							Have you reviewed your filters and confirmed the data looks
							correct?
						</Typography>
					</Box>
				</Stack>
				<Box>
					<BaseFieldSet>
						<BaseLabel>Query Name</BaseLabel>
						<BaseInput
							required
							name="queryName"
							value={queryName}
							placeholder="Enter query name"
							onChange={(e) => handleChange(e)}
						/>
					</BaseFieldSet>
				</Box>
				{error && (
					<Typography
						fontFamily={"Inter"}
						fontWeight={"600"}
						fontSize={14}
						lineHeight={"normal"}
						color={"var(--error-red-color)"}
						whiteSpace={"normal"}
					>
						{error}
					</Typography>
				)}
				<Box overflow={"hidden"}>
					<BaseButton
						type="submit"
						variant="contained"
						disableElevation
						disabled={isLoading}
						sx={{
							width: { mobile: "100%", miniTablet: "auto" },
							float: { mobile: "none", miniTablet: "right" },
						}}
					>
						{isLoading && (
							<CircularProgress color="inherit" className="loader" />
						)}
						<Typography
							variant={"button"}
							fontFamily={"inherit"}
							fontWeight={"inherit"}
							fontSize={"inherit"}
							lineHeight={"inherit"}
							color={"inherit"}
							textTransform={"inherit"}
							visibility={isLoading ? "hidden" : "visible"}
						>
							Yes, Save
						</Typography>
					</BaseButton>
				</Box>
			</SaveQueryFormWrapper>
		</BaseFormModal>
	);
};
