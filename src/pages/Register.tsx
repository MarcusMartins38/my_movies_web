import { AuthPageShell } from "@/components/AuthPageShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import axios from "@/lib/axios";
import { AppDispatch } from "@/store";
import { login } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import * as axiosLib from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const schema = z
    .object({
        username: z.string().min(1, "Username is required"),
        email: z.string().email("Invalid email"),
        password: z.string().min(1, "Password is required"),
        confirmPassword: z.string().min(1, "Confirm Password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type FormData = z.infer<typeof schema>;

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [formError, setFormError] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setFormError("");
        setLoading(true);

        try {
            await axios.post(`/users/register/`, {
                username: data.username,
                email: data.email,
                password: data.password,
                password_confirm: data.confirmPassword,
            });

            await dispatch(login({ username: data.username, password: data.password }));
            navigate("/home");
        } catch (err) {
            if (axiosLib.isAxiosError(err) && err.response) {
                setFormError(err.response.data.detail || "Registration failed");
            } else {
                setFormError("An unexpected error occurred");
            }
            setLoading(false);
        }
    };

    return (
        <AuthPageShell
            title="Create an account"
            subtitle="Enter your details to create your account"
            link={<Link to="/login">Login</Link>}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {formError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{formError}</div>}

                <div>
                    <label className="text-sm font-medium">Username</label>
                    <Input {...register("username")} disabled={loading} />
                    {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
                </div>

                <div>
                    <label className="text-sm font-medium">Email</label>
                    <Input type="email" {...register("email")} disabled={loading} />
                    {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="text-sm font-medium">Password</label>
                    <PasswordInput autoComplete="on" {...register("password")} disabled={loading} />
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div>
                    <label className="text-sm font-medium">Confirm Password</label>
                    <PasswordInput autoComplete="on" {...register("confirmPassword")} disabled={loading} />
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        "Sign Up"
                    )}
                </Button>
            </form>
        </AuthPageShell>
    );
};

export default Register;
