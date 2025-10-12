const BASE_ENDPOINT = process.env.REACT_APP_BASE_API;

export const connectToDBService = async (
	TOKEN: string,
	payload: any,
	datasource: string
) => {
	try {
		const response = await fetch(
			`${BASE_ENDPOINT}/api/v1/connection/connect-to-db`,
			{
				method: "POST",
				credentials: "include",
				headers: {
					Datasource: `${datasource}`,
					Authorization: `Bearer ${TOKEN}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
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
