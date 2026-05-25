import React from "react"
import { NavLink, Outlet } from "react-router-dom"
import "./Navbar.css"

export default function Navbar(){

    const activeStyles = {
        color: "#ff99aa"
    }

    return (
        <nav>
            <NavLink 
                to="wine-making"
                className={({ isActive }) =>
                    isActive ? "active" : null
                }    
            >
                Wine Making
            </NavLink>

            <NavLink 
                to="alban-knights-training-stones"
                className={({ isActive }) =>
                    isActive ? "active" : null
                }    
            >
                Alban Knights Training Stones
            </NavLink>

            <NavLink 
                to="cooking"
                className={({ isActive }) =>
                    isActive ? "active" : null
                }    
            >
                Get Cooked
            </NavLink>
        </nav>
    )
}