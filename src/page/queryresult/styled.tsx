import { Stack, styled } from "@mui/material";

export const QueryResultWrapper = styled(Stack)(({ theme }) => {
	return {
		gap: "calc(var(--flex-gap))",
		overflow: "hidden",
	};
});
