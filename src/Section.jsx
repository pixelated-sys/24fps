import Poster from "./Poster";
import "./Section.css";

export default function Section({ title, movies, onAddToWatchlist,watchlist, onAddToWatched, watched }){
    if (!movies || !Array.isArray(movies)) return null;
    
    return(
        <div className="section-container">
            <h1 className="section-title notable-regular">
                {title}
            </h1>
            <div className="section">
                {movies.map((movie) => (
                    <Poster
                        key={movie.id}
                        movie={movie}
                        onAddToWatchlist={onAddToWatchlist}
                        onAddToWatched={onAddToWatched}
                        watchlist={watchlist}
                        watched={watched}
                    />
                ))}
            </div>
        </div>
    );
}