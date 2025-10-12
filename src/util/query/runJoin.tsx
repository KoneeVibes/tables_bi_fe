const BASE_ENDPOINT = process.env.REACT_APP_BASE_API;

export const joinTablesService = async (
	token: string,
	datasource: string,
	payload: any,
	filters?: { [key: string]: boolean }
) => {
	const queryParams = filters
		? new URLSearchParams(
				Object.entries(filters).reduce<Record<string, string>>(
					(acc, [key, value]) => {
						acc[key] = String(value);
						return acc;
					},
					{}
				)
		  ).toString()
		: "";
	try {
		const response = await fetch(
			`${BASE_ENDPOINT}/api/v1/query/run-join?${queryParams}`,
			{
				method: "POST",
				credentials: "include",
				headers: {
					Datasource: `${datasource}`,
					Authorization: `Bearer ${token}`,
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
