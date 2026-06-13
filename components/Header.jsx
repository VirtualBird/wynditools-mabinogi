import React, { useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import Navbar from "./Navbar/Navbar"

import menuIcon from '../src/assets/icons/bars-solid-full.svg'

export default function Header(){
    const [isOpen, setOpen] = React.useState(false)
    const menuBtnRef = useRef()

    useEffect(() => {
        // Don't bother attaching event listener if the Menu Button isn't open
        if (!isOpen) return
        
        console.log("mounting click event for menu")
        
        function handleClick(event){
            if (!menuBtnRef.current?.contains(event.target)){
                setOpen(false)
            }
        }

        document.addEventListener('click', handleClick)

        // Cleanup
        return () =>{
            document.removeEventListener('click', handleClick)
            
            console.log("unmounting click event for menu")
        }
    },[isOpen])

    function menuBtnToggle(){
        console.log("Toggling")
        setOpen(prev => !prev)
    }

    return (
        <header>
            <button className="menu-btn" ref={menuBtnRef} onClick={() => menuBtnToggle()}><img src={menuIcon}/></button>
            <Link to="/" className="header-home"><h1>Wynditools</h1></Link>
            
            <Navbar isOpen={isOpen} closeNav={() => setOpen(false)}/>
        </header>
    )
}