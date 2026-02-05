import { useState } from "react";
import "./Popular.css"
import Poster from "./Poster";
import d from './assets/drama.json';

export default function Popular({ onAddToWatchlist , watchlist, onAddToWatched, watched}){
    const [popularMovies, setPopularMovies] = useState(d.content);
    //setPopularMovies([])
    let count = 0;
    return (
        <div className="popular-container notable-regular">
            <h1 className="popular-title">Popular this Week</h1>
            <div className="popular">
            {popularMovies.map((movie)=>
                <div key={movie.id} className="popular-poster">
                    <h1 className="rank">{count+=1}</h1>
                    <Poster id={movie.id} aria-label={movie.title} movie={movie} onAddToWatchlist={onAddToWatchlist} watchlist={watchlist} onAddToWatched={onAddToWatched} watched={watched} />
                </div>
            )}
            </div>
        </div>
    );
}