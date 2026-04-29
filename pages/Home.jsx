import React from "react"
import {Link} from "react-router-dom"

export default function Home(){
    return (
        <div className="home-container">
            <h1>Home Component</h1>
            <p>Excuse the layout this is still a work in progress some things are liable to break while under construction</p>
            <Link to="wine-making">
                <div className="tile-container">
                    Wine Making Calculator
                </div>
            </Link>
            
            <Link to="alban-knights-training-stones">
                <div className="tile-container">
                    Alban Knight Stone Calculator
                </div>
            </Link>
        </div>
    )
}