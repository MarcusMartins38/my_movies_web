import { Eye, EyeOff } from "lucide-react";
import type { InputHTMLAttributes } from "react";
import { forwardRef, useState } from "react";
import { Input } from "./input";

type PasswordInputProps = InputHTMLAttributes<HTMLInputElement>;

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input
                type={showPassword ? "text" : "password"}
                ref={ref}
                {...props}
                className={`pr-10 ${className ?? ""}`}
            />
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                tabIndex={-1}
            >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
    );
});

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
