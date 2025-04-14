import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUserProfile, updateUserProfile } from "@/store/slices/authSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const accountSchema = z
    .object({
        username: z.string().min(1, "Username is required"),
        email: z.string().email("Invalid email"),
        currentPassword: z.union([z.string().min(1, "Current password is required"), z.literal("")]).optional(),
        newPassword: z.union([z.string().min(6, "Minimum 6 characters"), z.literal("")]).optional(),
        confirmPassword: z.union([z.string().min(1, "Please confirm the new password"), z.literal("")]).optional(),
    })
    .refine(
        (data) => {
            if (data.newPassword && data.newPassword !== data.confirmPassword) {
                return false;
            }
            return true;
        },
        {
            message: "Passwords do not match",
            path: ["confirmPassword"],
        },
    );

type AccountFormData = z.infer<typeof accountSchema>;

export default function AccountSettings() {
    const dispatch = useAppDispatch();
    const { user, accessToken } = useAppSelector((state) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
        setValue,
    } = useForm<AccountFormData>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            username: "",
            email: "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    useEffect(() => {
        if (accessToken && !user) {
            dispatch(fetchUserProfile());
        }
    }, [accessToken, user, dispatch]);

    useEffect(() => {
        if (user) {
            reset((prev) => ({
                ...prev,
                username: user.username,
                email: user.email,
            }));
        }
    }, [user, reset]);

    const onSubmit = (data: AccountFormData) => {
        const updateData: any = {};

        if (data.username !== user?.username) {
            updateData.username = data.username;
        }

        if (data.email !== user?.email) {
            updateData.email = data.email;
        }

        if (data.newPassword) {
            updateData.current_password = data.currentPassword;
            updateData.new_password = data.newPassword;
            updateData.confirm_new_password = data.confirmPassword;
        }

        dispatch(updateUserProfile(updateData))
            .unwrap()
            .then(() => {
                toast("Your profile has been updated successfully!", {
                    style: { backgroundColor: "#10b981", color: "white" },
                });

                setValue("currentPassword", "");
                setValue("newPassword", "");
                setValue("confirmPassword", "");
            })
            .catch((error) => {
                toast(typeof error === "object" ? Object.values(error).flat().join(", ") : error.toString(), {
                    style: { backgroundColor: "#ef4444", color: "white" },
                });
            });
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

                            <Button type="submit" disabled={!isDirty} className="w-full">
                                Update Account
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
