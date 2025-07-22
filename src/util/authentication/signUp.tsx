const BASE_ENDPOINT = process.env.REACT_APP_BASE_API;

export const signUpUser = async (payload: any) => {
    try {
        const response = await fetch(`${BASE_ENDPOINT}/api/v1/authentication/signup`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        const res = await response.json();
        if (!response.ok) {
            console.error('Error:', res);
            throw new Error(res.message);
        }
        return res;
    } catch (error) {
        console.error('API fetch error:', error);
        throw error;
    }
};
