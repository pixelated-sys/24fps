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
  // const [username, setUsername] = useState("");
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
    setToken(null);
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
        // 2. Create a reusable config with the clean Bearer token
        const config = {
            headers: { Authorization: `Bearer ${cleanToken}` }
        };

        try {
            console.log("Fetching genre data for:", username);
            
            // 3. Perform parallel requests
            const [comedyRes, dramaRes, horrorRes, popularRes] = await Promise.all([
                axios.get("http://localhost:3000/api/genre/Comedy"),
                axios.get("http://localhost:3000/api/genre/Drama"),
                axios.get("http://localhost:3000/api/genre/Horror"),
                axios.get("http://localhost:3000/api/getPopularRecords")
            ]);
            console.log("DEBUG: Comedy Data ->", comedyRes);
            console.log("DEBUG: Drama Data ->", dramaRes);
            console.log("DEBUG: Horror Data ->", horrorRes);
            console.log("DEBUG: Popular Page Object ->", popularRes.data.content);

            // 4. Update state with the returned List<MovieRecord>
            setComedy(comedyRes.data || []);
            setDrama(dramaRes.data || []);
            setHorror(horrorRes.data || []);
            
            // Note: Popular endpoint returns a Page object, genres return a List
            setPopular(popularRes.data.content || []);

        } catch (error) {
            console.error("Error fetching genre data:", error.response?.status);
        }
    };

    fetchData();
}, [token, username]);

  // useEffect(() => 
    // {
    // const cleanToken = token ? token.replace(/^"|"$/g,'') : null;
    // if(!cleanToken || token == null || !username || username == ""){
    //   console.log("Waiting for token and username.");
    //   return;
    // }
    // const fetchData = async () => {
    //   console.log("FETCHING DATA NOW...",token.substring(0, 10) + "..."); // If you don't see this, the check above failed
        
    //   const config = {
    //         headers: { Authorization: `Bearer ${cleanToken}` }
    //   };
    //   try {
    //     const [watchlistRes, watchedRes, comedyRes, dramaRes, horrorRes, popularRes] = await Promise.all([
    //       axios.get("http://localhost:3000/api/watchlist/getWatchlist",{
    //         headers: {
    //           Authorization: `Bearer ${token}`
    //         }
    //       }),
    //       axios.get("http://localhost:3000/api/watchedHistory/user/getWatched",{
    //         headers: {
    //           Authorization: `Bearer ${token}`
    //         }
    //       }),
    //       axios.get("http://localhost:3000/api/genre/Comedy",config
    //         // {
    //         // headers: {
    //         //   Authorization: `Bearer ${token}`
    //         // }}
    //       ),
    //       axios.get("http://localhost:3000/api/genre/Drama",{
    //         headers: {
    //           Authorization: `Bearer ${token}`
    //         }
    //       }),
    //       axios.get("http://localhost:3000/api/genre/Horror",{
    //         headers: {
    //           Authorization: `Bearer ${token}`
    //         }
    //       }),
    //       axios.get("http://localhost:3000/api/getPopularRecords",{
    //         headers: {
    //           Authorization: `Bearer ${token}`
    //         }
    //       })
    //     ]);

  //       console.log("DEBUG: Comedy Data ->", comedyRes.data);
  //       console.log("DEBUG: Drama Data ->", dramaRes.data);
  //       console.log("DEBUG: Popular Page Object ->", popularRes.data.content);
      
  //       console.log("watchlistRes:", watchlistRes);
  //       console.log("comedyRes:", comedyRes);
  //       console.log("dramaRes:", dramaRes);
  //       console.log("horrorRes:", horrorRes);
  //       console.log("popularRes:", popularRes);
  //       console.log("watched:", watchedRes);
    
  //       setWatchlist(watchlistRes?.data || []);
  //       setComedy(comedyRes.data || []);
  //       setDrama(dramaRes.data || []);
  //       setHorror(horrorRes.data || []);
  //       setPopular(popularRes.data.content || []);
  //       setWatched(watchedRes?.data || []);

  //     } catch (error) {
  //       console.log("error while fetching data:", error.response?.status || error.message);
  //       if(error.response?.status === 401) {
  //         console.error("JWT Token rejected. Check backend SecurityConfig CORS or Filter.");
  //     }
  //     }
  //   };
  //   if(token){
  //     fetchData();
  //   }
  // }, [token, username]);

  
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
              {/* <Popular watchlist={watchlist} onAddToWatchlist={handleAddToWatchlist} watched={watched} onAddToWatched={handleAddToWatched}/> */}
              <Popular movies={popular} watchlist={watchlist} onAddToWatchlist={handleAddToWatchlist} watched={watched} onAddToWatched={handleAddToWatched}/>
              <Section title="Drama" movies={drama} watchlist={watchlist} onAddToWatchlist={handleAddToWatchlist} watched={watched} onAddToWatched={handleAddToWatched} />
              <Section title="Comedy" movies={comedy} watchlist={watchlist} onAddToWatchlist={handleAddToWatchlist} watched={watched} onAddToWatched={handleAddToWatched}/>
              <Section title="Horror" movies={horror} watchlist={watchlist} onAddToWatchlist={handleAddToWatchlist} watched={watched} onAddToWatched={handleAddToWatched} />
              {/* <Section title="Comedy" movies={comedy} watchlist={watchlist} onAddToWatchlist={handleAddToWatchlist} watched={watched} onAddToWatched={handleAddToWatched}/> */}
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
