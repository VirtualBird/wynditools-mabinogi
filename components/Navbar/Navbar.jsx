import React from "react"
import { NavLink, Outlet } from "react-router-dom"
import "./Navbar.css"

// Uhh maybe I don't need to pass the function prop anymore after changing the button logic in Header.jsx
export default function Navbar({isOpen, closeNav}){

    const activeStyles = {
        color: "#ff99aa"
    }

    return (
        <nav className={isOpen ? "isOpen": ""} >
            <NavLink 
                to="wine-making"
                className={({ isActive }) =>
                    isActive ? "active" : null
                }    
                // onClick={closeNav}
            >
                Wine Making
            </NavLink>

            <NavLink 
                to="alban-knights-training-stones"
                className={({ isActive }) =>
                    isActive ? "active" : null
                }    
                // onClick={closeNav}
            >
                Alban Knights Training Stones
            </NavLink>

            <NavLink 
                to="cooking"
                className={({ isActive }) =>
                    isActive ? "active" : null
                }    
                // onClick={closeNav}
            >
                Get Cooked
            </NavLink>
        </nav>
    )
}