import React from "react"
import {Link} from "react-router-dom"

export default function Home(){
    return (
        <div className="home-container">
            <h1>Home Component</h1>
            <p>Excuse the layout this is still a work in progress some things are liable to break while under construction</p>
            
            <Link to="wine-making" className="tile-container style-btn-cute">
                Wine Making Calculator
            </Link>
            
            <Link to="alban-knights-training-stones" className="tile-container style-btn-cute">
                Alban Knight Stone Calculator
            </Link>

            <Link to="cooking" className="tile-container style-btn-cute">
                Cooking (under construction)
            </Link>
            <div className="external-links">
                <p>
                    <a href="https://www.nexon.com/mabinogi/" target="_blank">Official Mabinogi NA Site</a>
                </p>
                <p>
                    <a href="https://wiki.mabinogiworld.com/" target="_blank">Mabinogi World Wiki (NA Wiki)</a>
                </p>
            </div>
        </div>
    )
}