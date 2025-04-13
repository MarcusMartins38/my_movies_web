import AddWatchedMovieModal from "@/components/AddWatchedMovieModal";
import Header from "@/components/Header";
import RecommendedMoviesCarousel from "@/components/RecommendedMoviesCarousel";
import { Button } from "@/components/ui/button";
import WatchedMovieCard from "@/components/WatchedMovieCard";
import axios from "@/lib/axios";
import { Movie } from "@/types";
import { useEffect, useState } from "react";

export default function Home() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get("/movies/");
                setWatchedMovies(response.data);
            } catch (error) {
                console.error("Failed to load movies", error);
            }
        };

        fetchMovies();
    }, []);

    const handleDelete = (movieId: number) => {
        setWatchedMovies((prev) => prev.filter((movie) => movie.id !== movieId));
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Header />

            <RecommendedMoviesCarousel />

            {/* Watched Movies Section */}
            <section className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">My Watched Movies</h3>
                    <Button onClick={() => setDialogOpen(true)} className="bg-white text-black hover:bg-gray-200">
                        Add Watched Movie
                    </Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {watchedMovies.map((movie) => (
                        <WatchedMovieCard key={movie.id} movie={movie} onDelete={handleDelete} />
                    ))}
                </div>
            </section>

            <AddWatchedMovieModal
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onMovieAdded={(newMovie) => setWatchedMovies((prev) => [...prev, newMovie])}
            />
        </div>
    );
}
