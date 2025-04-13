import { Movie } from "@/types";

interface Props {
    movie: Movie;
}

export default function WatchedMovieCard({ movie }: Props) {
    return (
        <div className="bg-white text-black rounded-md overflow-hidden shadow-md">
            <img
                src={
                    movie?.image_url ||
                    "https://cdn1.polaris.com/globalassets/pga/accessories/my20-orv-images/no_image_available6.jpg?v=71397d75&format=webp&height=800"
                }
                alt={movie.title}
                className="w-full h-[260px] object-cover"
            />
            <div className="p-3">
                <h4 className="font-semibold text-base mb-1 truncate">{movie.title}</h4>
                <p className="text-sm text-yellow-600 font-semibold mb-1">⭐ {movie.rate}/10</p>
                <p className="text-xs text-gray-500 truncate">{movie.description}</p>
            </div>
        </div>
    );
}
