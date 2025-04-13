import { AuthLayout } from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppDispatch, RootState } from "@/store";
import { login } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

const schema = z.object({
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

const Login = () => {
    const { error, loading } = useSelector<RootState>((state) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        try {
            await dispatch(login({ username: data.username, password: data.password }));
            navigate("/home");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AuthLayout
            title="Login to your account"
            subtitle="Enter your credentials to access your account"
            link={<Link to="/register">Create account</Link>}
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md">{error}</div>}

                <div>
                    <label className="text-sm font-medium">Username</label>
                    <Input {...register("username")} disabled={loading} />
                    {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
                </div>

                <div>
                    <div className="flex justify-between">
                        <label className="text-sm font-medium">Password</label>
                        <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                            Forgot password?
                        </Link>
                    </div>
                    <Input type="password" autoComplete="on" {...register("password")} disabled={loading} />
                    {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging in...
                        </>
                    ) : (
                        "Sign in"
                    )}
                </Button>
            </form>
        </AuthLayout>
    );
};

export default Login;
