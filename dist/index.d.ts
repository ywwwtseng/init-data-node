type User<T = string> = {
    added_to_attachment_menu?: boolean;
    allows_write_to_pm?: boolean;
    first_name: string;
    id: T;
    is_bot?: boolean;
    is_premium?: boolean;
    last_name?: string;
    language_code?: string;
    photo_url?: string;
    username?: string;
} & {
    [key: string]: unknown;
};
declare const validate: ({ headers, botToken, skip, }: {
    headers: Headers;
    botToken: string;
    skip?: boolean;
}) => {
    user: User<string>;
    hash: string;
    signature: string;
    start_param: string | null;
};

export { type User, validate };
