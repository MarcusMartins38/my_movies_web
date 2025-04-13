import Header from "@/components/Header";
import RecommendedMoviesCarousel from "@/components/RecommendedMoviesCarousel";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Home() {
    const [watchedMovies, setWatchedMovies] = useState([]);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <Header />

            {/* Hero Section Carousel */}
            <RecommendedMoviesCarousel />

            {/* Watched Movies Section */}
            <section className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">My Watched Movies</h3>
                    <Button className="bg-white text-black hover:bg-gray-200">Add Watched Movie</Button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {watchedMovies.map((movie) => (
                        <div key={movie.title} className="bg-white text-black rounded-md overflow-hidden shadow-md">
                            <img src={movie.image} alt={movie.title} className="w-full h-[260px] object-cover" />
                            <div className="p-3">
                                <h4 className="font-semibold text-base mb-1 truncate">{movie.title}</h4>
                                <p className="text-xs text-gray-600 truncate">{movie.year}</p>
                                <p className="text-xs text-gray-500 truncate">{movie.genres}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
