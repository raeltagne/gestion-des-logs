import { useState } from "react";
import { Link } from "react-router-dom";
import './Navbar.css';
import { useAuth } from "../../AuthContext";

export const Navbar=() =>{
    const [isOpen,setIsOpen]=useState(false);
   const {logout}=useAuth();
    return(
        <nav className="navbar">
            <div className="brand">
                <img src="../../../logo.jpg" alt="freemopay" className="logo" />
                <h2>Freemo - Logs</h2>
            </div>
            <button className="menu-toggle" onClick={()=> setIsOpen(!isOpen)}> ...</button>
            <ul className={isOpen? "nav-links open" : "nav-links"}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/reports">Reports</Link></li>
                <li><Link to="/stats">Statistics</Link></li>
                <li><Link to="/users">Users</Link></li>
                <li><Link to="/app">Applications</Link></li>
                <li onClick={logout} style={{cursor:'pointer'}} >Disconnect</li>
            </ul>
        </nav>
    );
};