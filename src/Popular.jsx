import { useState } from "react";
import "./Popular.css"
import Poster from "./Poster";

export default function Popular({ movies, onAddToWatchlist , watchlist, onAddToWatched, watched}){
    if (!movies || !Array.isArray(movies)) return null;
    
    let count = 0;
    return (
        <div className="popular-container notable-regular">
            <h1 className="popular-title">Popular this Week</h1>
            <div className="popular">
            {movies.map((movie)=>
                <div key={movie.internalId} className="popular-poster">
                    <h1 className="rank">{count+=1}</h1>
                    <Poster movie={movie} onAddToWatchlist={onAddToWatchlist} watchlist={watchlist} onAddToWatched={onAddToWatched} watched={watched} />
                </div>
            )}
            </div>
        </div>
    );
}