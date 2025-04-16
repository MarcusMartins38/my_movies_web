type AuthPageShellProps = {
    title: string;
    subtitle?: string;
    link?: React.ReactNode;
    children: React.ReactNode;
};

export function AuthPageShell({ title, subtitle, link, children }: AuthPageShellProps) {
    return (
        <div className="w-full max-w-md">
            <div className="flex justify-end mb-8">{link}</div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            <p className="text-gray-500 mb-6">{subtitle}</p>
            {children}
        </div>
    );
}
