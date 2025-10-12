const BASE_ENDPOINT = process.env.REACT_APP_BASE_API;

export const retrieveAllSavedQueryService = async (token: string) => {
	try {
		const response = await fetch(
			`${BASE_ENDPOINT}/api/v1/saved-view/all/query`,
			{
				method: "GET",
				credentials: "include",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			}
		);
		const res = await response.json();
		if (!response.ok) {
			console.error("Error:", res);
			throw new Error(res.message);
		}
		return res.data;
	} catch (error) {
		console.error("API fetch error:", error);
		throw error;
	}
};
