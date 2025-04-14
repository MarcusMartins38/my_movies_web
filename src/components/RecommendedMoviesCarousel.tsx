import { useEffect, useState } from "react";
import batmanBeginsImg from "../assets/images/batman-begins.jpg";
import dunkirkImg from "../assets/images/dunkirk.jpg";
import spiderVerseImg from "../assets/images/spider-verse.jpg";
import strangerThingsImg from "../assets/images/stranger-things.jpg";

const recommendedMoviesCarousel = [
    {
        title: "Stranger Things",
        year: "USA, 2016 - Current",
        genres: "Action, Adventure, Horror",
        image: strangerThingsImg,
    },
    {
        title: "Batman Begins",
        year: "USA, 2005",
        genres: "Action, Adventure",
        image: batmanBeginsImg,
    },
    {
        title: "Spider-Man: Into The Spider Verse",
        year: "USA, 2018",
        genres: "Animation, Action, Adventure",
        image: spiderVerseImg,
    },
    {
        title: "Dunkirk",
        year: "USA, 2017",
        genres: "Action, Drama, History",
        image: dunkirkImg,
    },
];

function RecommendedMoviesCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % recommendedMoviesCarousel.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const currentMovie = recommendedMoviesCarousel[currentIndex];

    return (
        <div
            className="relative h-[450px] bg-cover bg-center flex items-end p-6"
            style={{ backgroundImage: `url(${currentMovie.image})` }}
        >
            <div className="bg-gradient-to-t from-black via-black/60 to-transparent p-6 rounded-md min-w-[300px] max-w-xl">
                <h2 className="text-4xl text-white font-bold mb-2">{currentMovie.title}</h2>
                <p className="text-sm text-gray-300 mb-1">{currentMovie.year}</p>
                <p className="text-sm text-gray-400">{currentMovie.genres}</p>
            </div>
        </div>
    );
}

export default RecommendedMoviesCarousel;
