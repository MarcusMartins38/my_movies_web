import { useEffect, useState } from "react";

const recommendedMoviesCarousel = [
    {
        title: "Stranger Things",
        year: "USA, 2016 - Current",
        genres: "Action, Adventure, Horror",
        image: "https://nexo-uploads-beta.s3.amazonaws.com/wp-content/uploads/2023/11/29123634/stranger_binary_291670.jpg",
    },
    {
        title: "Batman Begins",
        year: "USA, 2005",
        genres: "Action, Adventure",
        image: "https://editoralobo.wordpress.com/wp-content/uploads/2020/06/wb-batman-begins-logo-4.jpg",
    },
    {
        title: "Spider-Man: Into The Spider Verse",
        year: "USA, 2018",
        genres: "Animation, Action, Adventure",
        image: "https://occ-0-8407-2218.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABQJS4sBQPC4_0n_BGxvYsNN8awoe83ynyc5nGRxoY0f_pvlB7boLdq9xoBJIFkdK2nWbHJ1m2bn--fXVwJVC_azrM94Ypjyf-s-I.jpg?r=91f",
    },
    {
        title: "Dunkirk",
        year: "USA, 2017",
        genres: "Action, Drama, History",
        image: "https://images7.alphacoders.com/855/855790.jpg",
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
                <h2 className="text-4xl font-bold mb-2">{currentMovie.title}</h2>
                <p className="text-sm text-gray-300 mb-1">{currentMovie.year}</p>
                <p className="text-sm text-gray-400">{currentMovie.genres}</p>
            </div>
        </div>
    );
}

export default RecommendedMoviesCarousel;
