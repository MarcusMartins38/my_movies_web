import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import * as axiosLib from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const schema = z
    .object({
        password: z.string().min(6, "Password must be at least 6 characters long"),
        confirmPassword: z.string().min(6, "Confirm password"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type FormData = z.infer<typeof schema>;

const ResetPassword = () => {
    const navigate = useNavigate();
    const { uid, token } = useParams<{ uid: string; token: string }>();
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        const validateToken = async () => {
            if (!uid || !token) {
                setIsValidToken(false);
                return;
            }

            try {
                const response = await axios.get(`/users/password-reset/validate/`, {
                    params: { uid, token },
                });
                setIsValidToken(response.data.valid);
            } catch (err) {
                setIsValidToken(false);
                setError("This reset link is invalid or expired.");
            }
        };

        validateToken();
    }, [uid, token]);

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setError(null);

        try {
            await axios.post("/users/password-reset/confirm/", {
                uid,
                token,
                password: data.password,
            });

            setSuccess(true);

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            if (axiosLib.isAxiosError(err) && err.response) {
                setError(err.response.data.detail || "An error occurred while resetting your password.");
            } else {
                setError("An error occurred while resetting your password. Try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isValidToken === null) {
        return (
            <AuthLayout title="Checking link..." subtitle="Please wait while we check your reset link." link={<></>}>
                <div className="flex justify-center py-4">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
            </AuthLayout>
        );
    }

    if (isValidToken === false) {
        return (
            <AuthLayout title="Invalid link" subtitle="This password reset link is invalid or expired." link={<></>}>
                <div className="text-center">
                    <p className="text-sm text-red-500 mb-4">{error || "Este link não é mais válido."}</p>
                    <Button onClick={() => navigate("/forgot-password")} className="mt-2">
                        Request new link
                    </Button>
                </div>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout
            title="Redefinir sua senha"
            subtitle="Digite uma nova senha abaixo"
            link={<Link to="/login">Back to login</Link>}
        >
            {success ? (
                <div className="text-center">
                    <p className="text-sm text-green-500 mb-2">Your password has been reset successfully!</p>
                    <p className="text-sm text-gray-500">Redirecting to login page...</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">New Password</label>
                        <Input type="password" autoComplete="new-password" {...register("password")} />
                        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                    </div>

                    <div>
                        <label className="text-sm font-medium">Confirm New Password</label>
                        <Input type="password" autoComplete="new-password" {...register("confirmPassword")} />
                        {errors.confirmPassword && (
                            <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Processing..." : "Reset Password"}
                    </Button>
                </form>
            )}
        </AuthLayout>
    );
};

export default ResetPassword;
