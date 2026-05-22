import React from "react"
import {useState} from "react"

import Slider from "./components/Slider"
import "./WineMaking.css"
import Tooltip from "../../components/Tooltip/Tooltip"

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
                <Slider name="acidity" 
                    tooltip="Acidity decreases if the player takes too long in the oak barrel replacement." 
                    value={wine.acidity} handleChange={(e) => handleChange(e)}/>
                <Slider name="purity" 
                    tooltip="Purity decreases if too many sediments are not taken out in the oak barrel replacement." 
                    value={wine.purity} handleChange={handleChange}/>
                <Slider name="freshness" 
                    tooltip="Freshness decreases if the player neglects to replace the oak barrel after 24 real-time hours, decaying by 1 point every 36 minutes after the 24 hour mark." 
                    value={wine.freshness} handleChange={handleChange}/>
                <Slider name="age" 
                    tooltip="Age slowly increases over time at a rate of approximately 1 age every 2.8 in-game days (or 1 hour, 40 minutes and 48 seconds real-time), and reaches maximum after exactly 280 in-game days (or one real-time week)." 
                    value={wine.age} handleChange={handleChange}/>

                <div className="wine-score">
                    <h2>Score</h2>
                    <Tooltip maxWidth={500} content={<><p>Score is calculated using the following formula</p>
                        <p className="italic formula-text">Score = (Purity+Acidity+Freshness+Age) * (lowest value between Purity, Acidity, Freshness, and Age) * 5</p></>}>
                    <div className="wine-score-value">
                        {calculateWineScore()}
                    </div>
                    </Tooltip>
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