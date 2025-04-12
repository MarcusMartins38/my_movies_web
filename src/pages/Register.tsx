import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const API_URL = "http://0.0.0.0:3000/api";

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
    const { login } = useAuth();

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
            const response = await axios.post(`${API_URL}/users/register/`, {
                username: data.username,
                email: data.email,
                password: data.password,
                password_confirm: data.confirmPassword,
            });

            await login(data.username, data.password);
            navigate("/home");
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                setFormError(err.response.data.detail || "Registration failed");
            } else {
                setFormError("An unexpected error occurred");
            }
            setLoading(false);
        }
    };

    return (
        <AuthLayout
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
                    <Input type="password" {...register("password")} disabled={loading} />
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <div>
                    <label className="text-sm font-medium">Confirm Password</label>
                    <Input type="password" {...register("confirmPassword")} disabled={loading} />
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <Button type="submit" className="w-full bg-black hover:bg-gray-800" disabled={loading}>
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
        </AuthLayout>
    );
};

export default Register;
