type AuthLayoutProps = {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    link?: React.ReactNode;
};

export function AuthLayout({ children, title, subtitle, link }: AuthLayoutProps) {
    return (
        <div className="flex flex-col md:flex-row h-screen">
            <div className="w-full md:w-2/5 bg-black text-white p-8 flex flex-col">
                <div className="mb-6 flex items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="icon icon-tabler icons-tabler-outline icon-tabler-device-tv"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
                        <path d="M16 3l-4 4l-4 -4" />
                    </svg>
                    <span className="font-bold text-xl ml-2">My Movies</span>
                </div>
                <div className="flex-grow flex flex-col justify-end">
                    <p className="text-xl font-medium mb-4">
                        "Keep track of your watched movies and share your ratings! Create an account to log the films
                        you’ve seen, rate them, and build your personal movie history."
                    </p>
                    <p className="text-sm">Marcus Martins</p>
                </div>
            </div>

            <div className="w-full md:w-3/5 p-8 flex flex-col items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="flex justify-end mb-8">{link}</div>
                    <h1 className="text-3xl font-bold mb-2">{title}</h1>
                    <p className="text-gray-500 mb-6">{subtitle}</p>
                    {children}
                </div>
            </div>
        </div>
    );
}
