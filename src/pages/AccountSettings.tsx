import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const accountSchema = z
    .object({
        username: z.string().min(1, "Username is required"),
        email: z.string().email("Invalid email"),
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(6, "Minimum 6 characters"),
        confirmPassword: z.string().min(1, "Please confirm the new password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

type AccountFormData = z.infer<typeof accountSchema>;

export default function AccountSettings() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AccountFormData>({
        resolver: zodResolver(accountSchema),
    });

    const onSubmit = (data: AccountFormData) => {
        console.log("Dados para atualizar:", data);
        // TODO: Enviar dados para backend
    };

    return (
        <>
            <Header />
            <div className="max-w-2xl mx-auto p-6">
                <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
                <div>
                    <div className="space-y-4 pt-6">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <Label>Username</Label>
                                <Input {...register("username")} />
                                {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                            </div>

                            <div>
                                <Label>Email</Label>
                                <Input type="email" {...register("email")} />
                                {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                            </div>

                            <div>
                                <Label>Current Password</Label>
                                <Input type="current-password" {...register("currentPassword")} />
                                {errors.currentPassword && (
                                    <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
                                )}
                            </div>

                            <div>
                                <Label>New Password</Label>
                                <Input type="new-password" {...register("newPassword")} />
                                {errors.newPassword && (
                                    <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                                )}
                            </div>

                            <div>
                                <Label>Confirm New Password</Label>
                                <Input type="new-password" {...register("confirmPassword")} />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full">
                                Update Account
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
