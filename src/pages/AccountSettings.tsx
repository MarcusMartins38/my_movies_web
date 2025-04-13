import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const accountSchema = z
    .object({
        username: z.string().min(1, "Username obrigatório"),
        email: z.string().email("Email inválido"),
        currentPassword: z.string().min(1, "Senha atual obrigatória"),
        newPassword: z.string().min(6, "Mínimo 6 caracteres"),
        confirmPassword: z.string().min(1, "Confirme a nova senha"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "As senhas não coincidem",
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
                                <Label>Senha atual</Label>
                                <Input type="password" {...register("currentPassword")} />
                                {errors.currentPassword && (
                                    <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
                                )}
                            </div>

                            <div>
                                <Label>Nova senha</Label>
                                <Input type="password" {...register("newPassword")} />
                                {errors.newPassword && (
                                    <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                                )}
                            </div>

                            <div>
                                <Label>Confirmar nova senha</Label>
                                <Input type="password" {...register("confirmPassword")} />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full">
                                Atualizar dados
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
