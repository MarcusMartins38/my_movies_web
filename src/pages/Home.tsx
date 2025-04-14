import AddWatchedMovieModal from "@/components/AddWatchedMovieModal";
import EditMovieModal from "@/components/EditMovieModal";
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
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);

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

    const handleCardClick = (movie: Movie) => {
        setSelectedMovie(movie);
        setIsEditOpen(true);
    };

    const handleUpdate = (updated: Movie) => {
        setWatchedMovies((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    };

    return (
        <div className="min-h-screen">
            <Header />

            <RecommendedMoviesCarousel />

            {/* Watched Movies Section */}
            <section className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">My Watched Movies</h3>
                    <Button onClick={() => setDialogOpen(true)}>Add Watched Movie</Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {watchedMovies.map((movie) => (
                        <WatchedMovieCard
                            key={movie.id}
                            movie={movie}
                            onDelete={handleDelete}
                            onClick={handleCardClick}
                        />
                    ))}
                </div>
            </section>

            {selectedMovie && (
                <EditMovieModal
                    open={isEditOpen}
                    onClose={() => setIsEditOpen(false)}
                    movie={selectedMovie}
                    onUpdate={handleUpdate}
                />
            )}

            <AddWatchedMovieModal
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onMovieAdded={(newMovie) => setWatchedMovies((prev) => [...prev, newMovie])}
            />
        </div>
    );
}
