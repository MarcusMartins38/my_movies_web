import axios from "@/lib/axios";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import Home from "../Home";

vi.mock("@/components/Header", () => ({
    default: () => <div>Mock Header</div>,
}));

vi.mock("@/components/RecommendedMoviesCarousel", () => ({
    default: () => <div>Mock Carousel</div>,
}));

vi.mock("@/components/WatchedMovieCard", () => {
    return {
        default: ({ movie, onClick, onDelete }) => (
            <div data-testid={`movie-${movie.id}`} onClick={() => onClick(movie)}>
                <span>{movie.title}</span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(movie.id);
                    }}
                >
                    Delete
                </button>
            </div>
        ),
    };
});

vi.mock("@/components/EditMovieModal", () => ({
    default: ({ open, onClose, movie, onUpdate }) =>
        open ? (
            <div>
                <span>Edit Movie</span>
                <span>{movie?.title}</span>
                <button onClick={() => onUpdate({ ...movie, title: "Updated Title" })}>Save Changes</button>
                <button onClick={onClose}>Close</button>
            </div>
        ) : null,
}));

vi.mock("@/components/AddWatchedMovieModal", () => ({
    default: ({ open, onClose, onMovieAdded }) =>
        open ? (
            <div>
                <span>Add Movie Modal</span>
                <button
                    onClick={() =>
                        onMovieAdded({
                            id: 999,
                            title: "New Movie",
                            image_url: "",
                            description: "",
                            rate: 8,
                            created_at: new Date().toISOString(),
                        })
                    }
                >
                    Save New Movie
                </button>
                <button onClick={onClose}>Cancel</button>
            </div>
        ) : null,
}));

vi.mock("@/lib/axios");

describe("Home component", () => {
    const mockMovies = [
        { id: 1, title: "Movie 1", rate: 5, created_at: "2023-01-01", image_url: "", description: "" },
        { id: 2, title: "Movie 2", rate: 8, created_at: "2023-01-02", image_url: "", description: "" },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (axios.get as any).mockResolvedValue({ data: mockMovies });
    });

    test("Rendering the components at Home page", async () => {
        render(<Home />);

        expect(screen.getByText("Mock Header")).toBeInTheDocument();
        expect(screen.getByText("Mock Carousel")).toBeInTheDocument();
        expect(screen.getByText("My Watched Movies")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText("Movie 1")).toBeInTheDocument();
            expect(screen.getByText("Movie 2")).toBeInTheDocument();
        });
    });

    test("Get movies when loads the page", async () => {
        render(<Home />);

        expect(axios.get).toHaveBeenCalledWith("/movies/", { params: { ordering: "-created_at" } });

        await waitFor(() => {
            expect(screen.getByText("Movie 1")).toBeInTheDocument();
            expect(screen.getByText("Movie 2")).toBeInTheDocument();
        });
    });

    test("Open watched movie Modal", async () => {
        render(<Home />);

        const addButton = screen.getByText("Add Watched Movie");
        fireEvent.click(addButton);

        expect(screen.getByText("Add Movie Modal")).toBeInTheDocument();
    });

    test("Add a new movie", async () => {
        render(<Home />);

        const addButton = screen.getByText("Add Watched Movie");
        fireEvent.click(addButton);

        const saveButton = screen.getByText("Save New Movie");
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText("New Movie")).toBeInTheDocument();
        });
    });

    test("Removes a movie", async () => {
        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText("Movie 1")).toBeInTheDocument();
        });

        const movieCards = screen.getAllByText("Delete");
        fireEvent.click(movieCards[0]);

        expect(screen.queryByText("Movie 1")).not.toBeInTheDocument();
        expect(screen.getByText("Movie 2")).toBeInTheDocument();
    });

    test("Opens edit modal when click at a Movie Card", async () => {
        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText("Movie 1")).toBeInTheDocument();
        });

        const movieCard = screen.getByTestId("movie-1");
        fireEvent.click(movieCard);

        expect(screen.getByText("Edit Movie")).toBeInTheDocument();
        expect(screen.getAllByText("Movie 1").length).toBe(2);
    });

    test("Updata the data of a movie", async () => {
        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText("Movie 1")).toBeInTheDocument();
        });

        const movieCard = screen.getByTestId("movie-1");
        fireEvent.click(movieCard);

        const saveButton = screen.getByText("Save Changes");
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText("Updated Title")).toBeInTheDocument();
        });
    });

    test("Change movie orders and request again", async () => {
        render(<Home />);

        await waitFor(() => {
            expect(screen.getByText("Movie 1")).toBeInTheDocument();
        });

        (axios.get as any).mockResolvedValueOnce({
            data: [
                { id: 2, title: "Movie 2", rate: 8, created_at: "2023-01-02", image_url: "", description: "" },
                { id: 1, title: "Movie 1", rate: 5, created_at: "2023-01-01", image_url: "", description: "" },
            ],
        });

        const selectTrigger = screen.getByRole("combobox");
        fireEvent.click(selectTrigger);

        await waitFor(() => {
            const rateOption = screen.getByText("Rate");
            fireEvent.click(rateOption);
        });

        expect(axios.get).toHaveBeenCalledWith("/movies/", { params: { ordering: "-rate" } });
    });
});
