import Poster from "./Poster";
import './Watched.css';
export default function Watched({ watched, toggleWatched, watchlist ,toggleWatchlist, username}){
    return (
        <>
            <h1>Movies You Watched</h1>
            <div>
                {watched.length === 0 ? (
                    <p>Go and watch some movies</p>
                ) : 
                    <div className="watched-container">
                        {watched.map((movie, index)=>(
                            <Poster key={movie.internalId || `watched-${index}`} movie={movie} onAddToWatched={toggleWatched} watched={watched} onAddToWatchlist={toggleWatchlist} watchlist={watchlist}/>
                        ))}
                    </div>
                }
            </div>
        </>
    )
}