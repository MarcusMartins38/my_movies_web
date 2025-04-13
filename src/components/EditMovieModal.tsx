import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import axios from "@/lib/axios";
import { Movie } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    title: z.string().min(1),
    image_url: z.union([z.string().url(), z.literal("")]).optional(),
    description: z.string().optional(),
    rate: z.number().min(1).max(10),
});

type FormData = z.infer<typeof schema>;

type Props = {
    open: boolean;
    onClose: () => void;
    movie: Movie;
    onUpdate: (movie: Movie) => void;
};

export default function EditMovieModal({ open, onClose, movie, onUpdate }: Props) {
    const { register, handleSubmit, setValue, watch } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { ...movie },
    });

    const rate = watch("rate");

    const onSubmit = async (data: FormData) => {
        const response = await axios.put(`/movies/${movie.id}/`, data);
        onUpdate(response.data);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="flex w-full gap-6 p-6 max-w-7xl sm:max-w-2xl">
                <img
                    src={
                        movie?.image_url ||
                        "https://cdn1.polaris.com/globalassets/pga/accessories/my20-orv-images/no_image_available6.jpg?v=71397d75&format=webp&height=800"
                    }
                    alt={movie.title}
                    className="w-1/2 h-[400px] object-cover rounded-md"
                />
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-1/2">
                    <DialogHeader>
                        <DialogTitle>Edit Movie</DialogTitle>
                    </DialogHeader>
                    <div>
                        <Label>Title</Label>
                        <Input {...register("title")} />
                    </div>
                    <div>
                        <Label>Image URL</Label>
                        <Input {...register("image_url")} />
                    </div>
                    <div>
                        <Label>Description</Label>
                        <Textarea {...register("description")} />
                    </div>
                    <div>
                        <Label>Rate: {rate}</Label>
                        <Slider
                            min={1}
                            max={10}
                            step={1}
                            value={[rate]}
                            onValueChange={(val) => setValue("rate", val[0])}
                        />
                    </div>
                    <Button type="submit" className="mt-4">
                        Save
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
