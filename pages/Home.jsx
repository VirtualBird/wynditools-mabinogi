import React from "react"
import {Link} from "react-router-dom"

export default function Home(){
    return (
        <div className="home-container container">
            <h1>Wynditools Mabinogi</h1>
            <p>Welcome to Wynditools, a web app made to help with Mabinogi related info</p>
            <p>This site is still being worked on and as such some features may be limited</p>
            
            
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