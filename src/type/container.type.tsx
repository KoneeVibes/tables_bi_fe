export type AuthLayoutPropsType = {
    children: React.ReactNode
};

export type SignUpFormPropsType = {
    error?: string | null,
    setError?: React.Dispatch<React.SetStateAction<string | null>>,
    formDetails: Record<string, any>,
    setFormDetails: React.Dispatch<React.SetStateAction<Record<string, any>>>
};