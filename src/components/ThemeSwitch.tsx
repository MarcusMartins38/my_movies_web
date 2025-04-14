import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleTheme } from "@/store/slices/themeSlice";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

export function ThemeSwitch() {
    const dispatch = useAppDispatch();
    const mode = useAppSelector((state) => state.theme.mode);

    useEffect(() => {
        const root = window.document.documentElement;
        if (mode === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
    }, [mode]);

    return (
        <Button variant="ghost" size="icon" onClick={() => dispatch(toggleTheme())}>
            {mode === "dark" ? <Sun className="!h-[20px] !w-[20px]" /> : <Moon className="!h-[20px] !w-[20px]" />}
        </Button>
    );
}
