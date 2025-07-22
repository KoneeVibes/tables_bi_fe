export type AuthLayoutPropsType = {
    children: React.ReactNode
};

export type SignUpFormPropsType = {
    formDetails: Record<string, any>
    setFormDetails: React.Dispatch<React.SetStateAction<Record<string, any>>>
};