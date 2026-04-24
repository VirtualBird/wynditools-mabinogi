import React from "react"
import { Link } from "react-router-dom"

export default function Header(){
    return (
        <header>
            <Link to="/"><h1>Wynditools</h1></Link>
        </header>
    )
}