import React from "react"
import {useState} from "react"

import Slider from "./components/Slider"
import "./WineMaking.css"

export default function Wine_Making(){

    const [wine, setWine] = useState({
        purity: 100,
        acidity: 100,
        freshness: 100,
        age: 0, 
    })

    function calculateWineScore()
    {
        const purity = Number(wine.purity)
        const acidity = Number(wine.acidity)
        const freshness = Number(wine.freshness)
        const age = Number(wine.age)

        const score = (purity + acidity + freshness + age) * Math.min(purity, acidity, freshness, age) * 5

        return score
    }

    // Handle changes to slider and updates Wine state's values
    function handleChange(event){
        console.log("slider value changed")
        const {value, name} = event.currentTarget
        // console.log(name)
        // console.log("Updating State: " + value)
        // console.log("Previous State: " + wine[name])

        setWine(prevValues => ({...prevValues, [name]: (value)}))
    }

    return (
        <div className="wine-making-page">
            <div className="container">

                <h1>Wine Making Calculator</h1>

                <Slider name="acidity" value={wine.acidity} handleChange={(e) => handleChange(e)}/>
                <Slider name="purity" value={wine.purity} handleChange={handleChange}/>
                <Slider name="freshness" value={wine.freshness} handleChange={handleChange}/>
                <Slider name="age" value={wine.age} handleChange={handleChange}/>

                <div className="wine-score">
                    <h2>Score</h2>
                    <div className="wine-score-value">
                        {calculateWineScore()}
                    </div>
                </div>
                <div className="score-details">
                    <p>Minimum score requirements</p>
                    <ul>
                        <li>60000</li>
                        <li>120000</li>
                        <li>160000</li>
                    </ul>
                    <p>Minimum of 60,000 score is required for Glyph Lore Rank 3 and Rank 2</p>
                </div>
                <div className="sources">
                    <p>Mabinogi Wiki Pages</p>
                    <p>
                        <a href="https://wiki.mabinogiworld.com/view/Wine_Making#Details" target="_blank">Wine Making Skill</a>
                        <a href="https://wiki.mabinogiworld.com/view/Pencast#Wine_Making_Rewards" target="_blank">Pencast Wine Making Rewards</a>
                    </p>
                </div>
            </div>
        </div>
        
    )
}