export type Movie = {
    id: number;
    title: string;
    image_url?: string;
    rate: number;
    description?: string;
};

export type UpdateUserData = {
    username?: string;
    email?: string;
    current_password?: string;
    new_password?: string;
    confirm_new_password?: string;
};
