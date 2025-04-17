import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { LogOut, Menu, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeSwitch } from "./ThemeSwitch";

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return (
        <header className="w-full flex justify-between items-center p-4 fixed z-9 bg-white text-black dark:bg-neutral-900 dark:text-white">
            <div
                onClick={() => navigate("/home")}
                className="flex items-center cursor-pointer transition-all duration-300 hover:text-[var(--primary)] "
            >
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
                    className="icon icon-tabler icons-tabler-outline icon-tabler-device-tv mr-2"
                >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 7m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
                    <path d="M16 3l-4 4l-4 -4" />
                </svg>
                <h1 className="text-2xl font-bold">My Movies</h1>
            </div>
            <div className="relative">
                <div className="flex items-center gap-2">
                    <ThemeSwitch />
                    <Menu className="cursor-pointer" onClick={() => setMenuOpen((prev) => !prev)} />
                </div>
                {menuOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded border z-50 shadow-md bg-white text-black dark:bg-neutral-900 dark:text-white dark:border-neutral-700">
                        <button
                            onClick={() => navigate("/settings")}
                            className="w-full px-4 py-2 hover:opacity-60 flex items-center gap-2"
                        >
                            <Settings size={16} /> Account Settings
                        </button>
                        <button
                            onClick={() => dispatch(logout())}
                            className="w-full text-[var(--primary)] px-4 py-2 hover:opacity-60 flex items-center gap-2"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
