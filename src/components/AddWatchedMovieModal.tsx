import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/lib/axios";
import { Movie } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    image_url: z.string().url("Invalid URL").optional().or(z.literal("")),
    description: z.string().optional(),
    rate: z.number().min(1).max(10),
});

type FormData = z.infer<typeof formSchema>;

type AddWatchedMovieModalProps = {
    open: boolean;
    onClose: () => void;
    onMovieAdded: (movie: Omit<Movie, "id">) => void;
};

export default function AddWatchedMovieModal({ open, onClose, onMovieAdded }: AddWatchedMovieModalProps) {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            image_url: "",
            description: "",
            rate: 1,
        },
    });

    const onSubmit = async (data: FormData) => {
        try {
            await axios.post("/movies/", data);
            onMovieAdded(data);
            reset();
            onClose();
        } catch (error) {
            console.error("Error saving movie:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-white text-black">
                <DialogHeader>
                    <DialogTitle>Add New Movie</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label className="mb-2">Title</Label>
                        <Input {...register("title")} />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    <div>
                        <Label className="mb-2">Image URL</Label>
                        <Input {...register("image_url")} />
                        {errors.image_url && <p className="text-red-500 text-sm">{errors.image_url.message}</p>}
                    </div>

                    <div>
                        <Label className="mb-2">Description</Label>
                        <Textarea {...register("description")} />
                    </div>

                    <div>
                        <Label className="mb-2">Rate</Label>
                        <Controller
                            name="rate"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Slider
                                        min={1}
                                        max={10}
                                        step={1}
                                        value={[field.value]}
                                        onValueChange={(val) => field.onChange(val[0])}
                                    />
                                    <span className="text-sm text-gray-600">Rate: {field.value}</span>
                                </>
                            )}
                        />
                    </div>

                    <Button type="submit" className="w-full mt-4">
                        Save Movie
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
