import { useState, useEffect } from "react";
import "./Poster.css"

export default function Poster({ movie, onAddToWatchlist, watchlist, onAddToWatched, watched }) {
    const [isHovered, setIsHovered] = useState(false);
    const [inWatchlist, setInWatchlist] = useState(false);
    const [inWatched, setInWatched] = useState(false);
    
    useEffect(() => {
        if (watchlist) {
            const isInWatchlist = watchlist.some(item => item.internalId === movie.internalId);
            setInWatchlist(isInWatchlist);
        }
    }, [watchlist, movie.id]);

    useEffect(() => {
        if (watched) {
            const isInWatched = watched.some(item => item.internalId === movie.internaId);
            setInWatched(isInWatched);
        }
    }, [watched, movie.id]);
    
    if (!movie) return null;

    const imageUrl = `https://image.tmdb.org/t/p/w342${movie.posterpath}`;
    
    const handleWatchlistClick = () => {
        onAddToWatchlist(movie);
        //setInWatchlist(!inWatchlist);
    };

    const handleWatchedClick = () => {
        onAddToWatched(movie);
        //setInWatchlist(!inWatched);
    };
    
    return (
        <div
            className="poster"
            key={movie.id}
            style={{
                backgroundImage: imageUrl ? `url(${imageUrl})` : "none",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={movie.title}
        >
            {isHovered && (
                <div className="options">
                    <button className={`watched-icon ${inWatched ? 'in-watched' : ''}`}
                        onClick={handleWatchedClick}
                        aria-label={`Add ${movie.title} to watched`}
                    ></button>
                    <button
                        className={`watchlist-icon ${inWatchlist ? 'in-watchlist' : ''}`}
                        onClick={handleWatchlistClick}
                        aria-label={`Add ${movie.title} to watchlist`}
                    ></button>
                </div>
            )}
        </div>
    );
}