import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "@/lib/axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const schema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

const ForgotPassword = () => {
    const [submitted, setSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        setIsLoading(true);
        setError(null);

        try {
            await axios.post("/users/password-reset/", { email: data.email });
            setSubmitted(true);
        } catch (err) {
            setSubmitted(true);
            if (process.env.NODE_ENV === "development") {
                setError(`Erro técnico: ${err instanceof Error ? err.message : "Erro desconhecido"}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Forgot your password?"
            subtitle="Enter your email to receive a reset link"
            link={<Link to="/login">Back to login</Link>}
        >
            {submitted ? (
                <div className="text-center">
                    <p className="text-sm text-green-500 mb-4">
                        If this email is registered, a recovery link has been sent.
                    </p>
                    <p className="text-sm text-gray-500">Check your inbox (and spam folder).</p>
                    {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
                </div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Email</label>
                        <Input {...register("email")} type="email" />
                        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "Enviando..." : "Enviar link de redefinição"}
                    </Button>
                </form>
            )}
        </AuthLayout>
    );
};

export default ForgotPassword;
