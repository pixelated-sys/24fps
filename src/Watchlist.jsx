import Poster from "./Poster";
import './Watchlist.css';
export default function Watchlist({ watchlist, toggleWatchlist, watched, toggleWatched, username}){
    return (
        <>
            <h1>Your Watchlist</h1>
            <div>
                {watchlist.length === 0 ? (
                    <p>No movies in your watchlist yet.</p>
                ) : 
                    <div className="watchlist-container">
                        {watchlist.map((movie, index)=>(
                            <Poster key={movie.internalId || `watchlist-${index}`} movie={movie} onAddToWatchlist={toggleWatchlist} watchlist={watchlist} onAddToWatched={toggleWatched} watched={watched}/>
                        ))}
                    </div>
                    
                }
            </div>
        </>
    )
}