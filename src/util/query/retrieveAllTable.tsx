const BASE_ENDPOINT = process.env.REACT_APP_BASE_API;

export const retrieveAllTableService = async (
	token: string,
	datasource: string
) => {
	try {
		const response = await fetch(`${BASE_ENDPOINT}/api/v1/query/all/table`, {
			method: "GET",
			credentials: "include",
			headers: {
				Datasource: `${datasource}`,
				Authorization: `Bearer ${token}`,
				"Content-Type": "application/json",
			},
		});
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
