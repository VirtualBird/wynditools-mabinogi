import React from "react"
import { Link } from "react-router-dom"
import Navbar from "./Navbar/Navbar"

import menuIcon from '../src/assets/icons/bars-solid-full.svg'

export default function Header(){
    return (
        <header>
            <button className="menu-btn"><img src={menuIcon}/></button>
            <Link to="/"><h1>Wynditools</h1></Link>
            
            <Navbar/>
        </header>
    )
}