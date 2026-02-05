import { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './Navbar';
import Popular from './Popular';
import dramaData from './assets/drama.json';
import Section from './Section';
import axios from 'axios';
import Watchlist from './Watchlist';
import Watched from './Watched';
import SignUp from './SignUp';
import Login from './Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [watchlist, setWatchlist] = useState([]);
  const [watched, setWatched] = useState([]);
  const [comedy,setComedy] = useState([]);
  const [drama,setDrama] = useState([]);
  const [horror,setHorror] = useState([]);
  const [popular,setPopular] = useState([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [watchlistRes, watchedRes, comedyRes, dramaRes, horrorRes, popularRes] = await Promise.all([
          axios.get("http://localhost:3000/watchlist"),
          axios.get("http://localhost:3000/watched"),
          axios.get("http://localhost:3000/api/top-popular/genre/Comedy"),
          axios.get("http://localhost:3000/api/top-popular/genre/Drama"),
          axios.get("http://localhost:3000/api/top-popular/genre/Horror"),
          axios.get("http://localhost:3000/api/popular_records")
        ]);
        
        console.log("watchlistRes:", watchlistRes);
        console.log("comedyRes:", comedyRes);
        console.log("dramaRes:", dramaRes);
        console.log("horrorRes:", horrorRes);
        console.log("popularRes:", popularRes);
        console.log("watched:", watchedRes);
    
        setWatchlist(watchlistRes?.data || []);
        setComedy(comedyRes?.data || []);
        setDrama(dramaRes?.data || []);
        setHorror(horrorRes?.data || []);
        setPopular(popularRes?.data || []);
        setWatched(watchedRes?.data || []);

      } catch (error) {
        console.log("error while fetching data:", error);
      }
    };
    
    fetchData();
  }, []);

  
  const handleAddToWatchlist = async (movie) => {
    const isInWatchlist = watchlist.some(item => item.id === movie.id);
    const previousWatchlist = watchlist;
    try{
      if (isInWatchlist){
        setWatchlist((prev)=> prev.filter((item)=>item.id !== movie.id));
        await axios.delete(`http://localhost:3000/watchlist/`,{movieId: movie.id, username :username});
      }
      else{
        if (watched.some(item => item.id === movie.id)){
          setWatched((prev)=> prev.filter((item)=>item.id !== movie.id));
          await axios.delete(`http://localhost:3000/watched/`,{movieId: movie.id,username :username});
        }
        setWatchlist((prev) =>  [...prev, movie]);
        await axios.post(`http://localhost:3000/watchlist`, {...movie, usernmae :username});
      }
    } catch (error){
      console.error("Error updating watchlist");
      setWatchlist(previousWatchlist);
    }
  };

  const handleAddToWatched = async (movie) => {
    const isInWatched = watched.some(item => item.id === movie.id);
    const previousWatched = watched;
    try{
      if (isInWatched){
      setWatched((prev)=> prev.filter((item)=>item.id !== movie.id));
      await axios.delete(`http://localhost:3000/watched/`,{movieId: movie.id,username :username});
      }
      else{
        if (watchlist.some(item => item.id === movie.id)){
          setWatchlist((prev)=> prev.filter((item)=>item.id !== movie.id));
          await axios.delete(`http://localhost:3000/watchlist/`,{movieId: movie.id,username :username});
        }
        setWatched((prev) =>  [...prev, movie]);
        await axios.post(`http://localhost:3000/watched`, {...movie, username: username});
      }
    } catch{
      console.log("Error updating watched");
      setWatched(previousWatched);
    }
    
  };

  //const dramaMovies = dramaData.content;
  console.log(watchlist);
  
  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route
          path='/'
          element={isAuthenticated ? (
            <>
              <Popular watchlist={watchlist} onAddToWatchlist={handleAddToWatchlist} watched={watched} onAddToWatched={handleAddToWatched}/>
              <Section title="Drama" movies={drama} watchlist={watchlist} onAddToWatchlist={handleAddToWatchlist} watched={watched} onAddToWatched={handleAddToWatched} />
              <Section title="Comedy" movies={comedy} watchlist={watchlist} onAddToWatchlist={handleAddToWatchlist} watched={watched} onAddToWatched={handleAddToWatched}/>
              <Section title="Drama" movies={horror} watchlist={watchlist} onAddToWatchlist={handleAddToWatchlist} watched={watched} onAddToWatched={handleAddToWatched} />
              <Section title="Comedy" movies={comedy} watchlist={watchlist} onAddToWatchlist={handleAddToWatchlist} watched={watched} onAddToWatched={handleAddToWatched}/>
            </>
          ) : <Navigate to="/signup" />}
        />
        <Route path='/watchlist' element={isAuthenticated ? <Watchlist  watchlist={watchlist} toggleWatchlist={handleAddToWatchlist} watched={watched} toggleWatched={handleAddToWatched}/> : <Navigate to="/signup" />}/>
        <Route path='/watched' element={isAuthenticated ? <Watched watched={watched} toggleWatched={handleAddToWatched} watchlist={watchlist} toggleWatchlist={handleAddToWatchlist}/> : <Navigate to="/signup" />}/>
        <Route path='/signup' element={!isAuthenticated ? <SignUp setIsAuthenticated={setIsAuthenticated} setUsername={setUsername}/> : <Navigate to="/" />} />
        <Route path='/login' element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} setUsername={setUsername}/> : <Navigate to="/" />} />
        <Route path='*' element={<Navigate to={isAuthenticated ? "/" : "/signup"} />} />
      </Routes>
    </>
  )
}

export default App
