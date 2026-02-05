import { NavLink } from 'react-router-dom'
import './Navbar.css'

export default function Navbar(){
    return (
        <div className='navbar nunito-sans-light'>
            <div className='navbar-left'>
                <div className='logo'>
                    <NavLink to="/">
                        <img src="src\assets\movies.svg" height="46" />
                    </NavLink>
                </div>
                <div className='watchlist'>
                    <NavLink to="/watchlist">
                        WATCHLIST
                    </NavLink>
                </div>
                <div className='watched'>
                    <NavLink to="/watched">
                        WATCHED
                    </NavLink>
                </div>
            </div>
            <div className='navbar-right'>
                <div className='search'>
                    <img src='src/assets/search.svg' height="20px"/>
                    <p>SEARCH</p>
                </div>
            </div>
        </div>
    )
}