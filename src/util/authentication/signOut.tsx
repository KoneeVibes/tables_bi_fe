const BASE_ENDPOINT = process.env.REACT_APP_BASE_API;

export const signOutUser = async (token: string) => {
	try {
		const response = await fetch(
			`${BASE_ENDPOINT}/api/v1/authentication/sign-out`,
			{
				method: "POST",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		const res = await response.json();
		if (!response.ok) {
			console.error("Error:", res);
			throw new Error(res.message);
		}
		return res;
	} catch (error) {
		console.error("API fetch error:", error);
		throw error;
	}
};
