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
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [watchlist, setWatchlist] = useState([]);
  const [watched, setWatched] = useState([]);
  const [comedy,setComedy] = useState([]);
  const [drama,setDrama] = useState([]);
  const [horror,setHorror] = useState([]);
  const [popular,setPopular] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [token,setToken] = useState(localStorage.getItem("token")||null);
  const login = (newToken, newUser) =>{
    localStorage.setItem("token",newToken);
    localStorage.setItem("username", newUser); 
    setToken(newToken);
    setUsername(newUser);
    setIsAuthenticated(true);
  }
  const logout = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername("");
    setIsAuthenticated(false);
    setWatchlist([]);
    setWatched([]);
    setComedy([]);
    setDrama([]);
    setHorror([]);
    setPopular([]);
    window.location.href = "/login";
  }

  useEffect(() => {
    // 1. Remove potential quotes from token
    const cleanToken = token ? token.replace(/^"|"$/g, '') : null;

    if (!cleanToken || !username) {
        console.log("Waiting for token and username.");
        return;
    }

    const fetchData = async () => {
        try {
            console.log("Fetching genre data for:", username);
            
            const [comedyRes, dramaRes, horrorRes, popularRes, watchlistRes, watchedRes] = await Promise.all([
                axios.get("http://localhost:3000/api/genre/Comedy", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("http://localhost:3000/api/genre/Drama", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("http://localhost:3000/api/genre/Horror", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get("http://localhost:3000/api/getPopularRecords", {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`http://localhost:3000/api/watchlist/getWatchlist?username=${username}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`http://localhost:3000/api/watchedHistory/getWatched?username=${username}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            console.log("DEBUG: Comedy Data ->", comedyRes);
            console.log("DEBUG: Drama Data ->", dramaRes);
            console.log("DEBUG: Horror Data ->", horrorRes);
            console.log("DEBUG: Popular Page Object ->", popularRes.data.content);
            console.log("DEBUG: Watchlist Data ->", watchlistRes.data);
            console.log("DEBUG: Watched Data ->", watchedRes.data);

            setComedy(comedyRes.data || []);
            setDrama(dramaRes.data || []);
            setHorror(horrorRes.data || []);
            
            setPopular(popularRes.data.content || []);
            setWatchlist(watchlistRes.data || []);
            setWatched(watchedRes.data || []);

        } catch (error) {
            console.error("Error fetching data:", error);
            console.error("Error details:", error.response?.data);
            console.error("Error status:", error.response?.status);
        }
    };

    fetchData();
}, [token, username]);
  
  const handleAddToWatchlist = async (movie) => {
    const isInWatchlist = watchlist.some(item => item.internalId === movie.internalId);
    const previousWatchlist = watchlist;
    try{
      if (isInWatchlist){
        setWatchlist((prev)=> prev.filter((item)=>item.internalId !== movie.internalId));
        await axios.delete(`http://localhost:3000/api/watchlist/deleteFromWatchlist`,{
          headers: { Authorization: `Bearer ${token}`},
          data: { movieId: movie.internalId,username :username }
        });
      }
      else{
        if (watched.some(item => item.internalId === movie.internalId)){
          setWatched((prev)=> prev.filter((item)=>item.internalId !== movie.internalId));
          await axios.delete(`http://localhost:3000/api/watchedHistory/deleteFromWatched`,{
            headers: {
              Authorization: `Bearer ${token}`
            },
            data: {movieId: movie.internalId,username :username}
          });
        }
        setWatchlist((prev) =>  [...prev, movie]);
        await axios.post(`http://localhost:3000/api/watchlist/addToWatchlist`, {movieId: movie.internalId, username :username},{
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
      }
    } catch (error){
      console.error("Error updating watchlist");
      setWatchlist(previousWatchlist);
    }
  };

  const handleAddToWatched = async (movie) => {
    const isInWatched = watched.some(item => item.internalId === movie.internalId);
    const previousWatched = watched;
    try{
      if (isInWatched){
        setWatched((prev)=> prev.filter((item)=>item.internalId !== movie.internalId));
        await axios.delete(`http://localhost:3000/api/watchedHistory/deleteFromWatched`,{
          headers: { Authorization: `Bearer ${token}`},
          data: { movieId: movie.internalId,username :username }
        });
      }
      else{
        if (watchlist.some(item => item.internalId === movie.internalId)){
          setWatchlist((prev)=> prev.filter((item)=>item.internalId !== movie.internalId));
          await axios.delete(`http://localhost:3000/api/watchlist/deleteFromWatchlist`,{
            headers: { Authorization: `Bearer ${token}`},
            data: { movieId: movie.internalId,username :username }
          });
        }
        setWatched((prev) =>  [...prev, movie]);
        await axios.post(`http://localhost:3000/api/watchedHistory/addToWatched`, {movieId: movie.internalId, username: username},{
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
      }
    } catch{
      console.log("Error updating watched");
      setWatched(previousWatched);
    }
    
  };

  console.log(watchlist);
  
  return (
    <>
      {isAuthenticated && <Navbar logout={logout}/>}
      <Routes>
        <Route
          path='/'
          element={isAuthenticated ? (
            <>
              <Popular movies={popular} watchlist={watchlist} onAddToWatchlist={handleAddToWatchlist} watched={watched} onAddToWatched={handleAddToWatched}/>
              <Section title="Drama" movies={drama} watchlist={watchlist} onAddToWatchlist={handleAddToWatchlist} watched={watched} onAddToWatched={handleAddToWatched} />
              <Section title="Comedy" movies={comedy} watchlist={watchlist} onAddToWatchlist={handleAddToWatchlist} watched={watched} onAddToWatched={handleAddToWatched}/>
              <Section title="Horror" movies={horror} watchlist={watchlist} onAddToWatchlist={handleAddToWatchlist} watched={watched} onAddToWatched={handleAddToWatched} />
            </>
          ) : <Navigate to="/signup" />}
        />
        <Route path='/watchlist' element={isAuthenticated ? <Watchlist  watchlist={watchlist} toggleWatchlist={handleAddToWatchlist} watched={watched} toggleWatched={handleAddToWatched}/> : <Navigate to="/signup" />}/>
        <Route path='/watched' element={isAuthenticated ? <Watched watched={watched} toggleWatched={handleAddToWatched} watchlist={watchlist} toggleWatchlist={handleAddToWatchlist}/> : <Navigate to="/signup" />}/>
        <Route path='/signup' element={!isAuthenticated ? <SignUp setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} setToken={login}/> : <Navigate to="/" />} />
        <Route path='/login' element={!isAuthenticated ? <Login setIsAuthenticated={setIsAuthenticated} setUsername={setUsername} setToken={login} /> : <Navigate to="/" />} />
        <Route path='*' element={<Navigate to={isAuthenticated ? "/" : "/signup"} />} />
      </Routes>
    </>
  )
}

export default App
