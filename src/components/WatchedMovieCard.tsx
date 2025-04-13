import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { Movie } from "@/types";
import { Trash2 } from "lucide-react";

interface WatchedMovieCardProps {
    movie: Movie;
    onDelete: (id: number) => void;
    onClick: (movie: Movie) => void;
}

export default function WatchedMovieCard({ movie, onDelete, onClick }: WatchedMovieCardProps) {
    const handleDelete = async () => {
        try {
            await axios.delete(`/movies/${movie.id}/`);
            onDelete(movie.id);
        } catch (err) {
            console.error("Failed to delete movie:", err);
        }
    };

    return (
        <div
            onClick={() => onClick(movie)}
            className="relative bg-white text-black rounded-md overflow-hidden shadow-md cursor-pointer hover:scale-102 transition-all duration-300 group"
        >
            <img
                src={
                    movie?.image_url ||
                    "https://cdn1.polaris.com/globalassets/pga/accessories/my20-orv-images/no_image_available6.jpg?v=71397d75&format=webp&height=800"
                }
                alt={movie.title}
                className="w-full h-[260px] object-cover"
            />

            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 hover:opacity-60 transition cursor-pointer"
                onClick={handleDelete}
            >
                <Trash2 className="h-5 w-5 text-red-500" />
            </Button>

            <div className="p-3">
                <h4 className="font-semibold text-base mb-1 truncate">{movie.title}</h4>
                <p className="text-sm text-yellow-600 font-semibold mb-1">⭐ {movie.rate}/10</p>
                <p className="text-xs text-gray-500 truncate">{movie.description}</p>
            </div>
        </div>
    );
}
