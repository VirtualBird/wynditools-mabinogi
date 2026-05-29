import React from "react"
import { Link } from "react-router-dom"
import Navbar from "./Navbar/Navbar"

import menuIcon from '../src/assets/icons/bars-solid-full.svg'

export default function Header(){
    const [isOpen, setOpen] = React.useState(false)

    function menuBtnToggle(){
        console.log("Toggling")
        setOpen(prev => !prev)
    }

    return (
        <header>
            <button className="menu-btn" onClick={() => menuBtnToggle()}><img src={menuIcon}/></button>
            <Link to="/" className="header-home"><h1>Wynditools</h1></Link>
            
            <Navbar isOpen={isOpen}/>
        </header>
    )
}