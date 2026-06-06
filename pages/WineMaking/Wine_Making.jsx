import React, { useEffect } from "react"
import {useState} from "react"

import Slider from "./components/Slider"
import "./WineMaking.css"
import Tooltip from "../../components/Tooltip/Tooltip"

export default function Wine_Making(){

    const [wine, setWine] = useState( () => {
        try {
            return (
                JSON.parse(localStorage.getItem("winemakingValues")) ?? {
                    purity: 100,
                    acidity: 100,
                    freshness: 100,
                    age: 0, 
                }
            )
        }
        catch {
            return {
                purity: 100,
                acidity: 100,
                freshness: 100,
                age: 0, 
            }
        }
    })

    useEffect(() => {
        // Might consider wrapping this in a try/catch too...? Probably not necessary though.
        localStorage.setItem("winemakingValues", JSON.stringify(wine))
    }, [wine])

    function calculateWineScore()
    {
        const purity = Number(wine.purity)
        const acidity = Number(wine.acidity)
        const freshness = Number(wine.freshness)
        const age = Number(wine.age)

        const score = (purity + acidity + freshness + age) * Math.min(purity, acidity, freshness, age) * 5

        return score
    }

    function scoreIsAboveValue(value){
        return calculateWineScore() > value
    }

    // Handle changes to slider and updates Wine state's values
    function handleChange(event){
        console.log("slider value changed")
        const {name, value} = event.currentTarget
        setWine(prevValues => ({...prevValues, [name]: (value)}))
    }

    return (
        <div className="wine-making-page">
            <div className="container">

                <h1>Wine Making Calculator</h1>
                <p>Click and hold to drag the sliders to calculate your Wine's score.</p>
                
                <Slider 
                    name="acidity" 
                    value={wine.acidity} handleChange={(e) => handleChange(e)}
                    tooltip="Acidity decreases if the player takes too long in the oak barrel replacement." 
                />
                <Slider 
                    name="purity"
                    value={wine.purity} handleChange={handleChange}
                    tooltip="Purity decreases if too many sediments are not taken out in the oak barrel replacement." 
                />
                <Slider 
                    name="freshness" 
                    value={wine.freshness} handleChange={handleChange}
                    tooltip="Freshness decreases if the player neglects to replace the oak barrel after 24 real-time hours, decaying by 1 point every 36 minutes after the 24 hour mark." 
                />
                <Slider 
                    name="age"
                    value={wine.age} handleChange={handleChange}
                    tooltip="Age slowly increases over time at a rate of approximately 1 age every 2.8 in-game days (or 1 hour, 40 minutes and 48 seconds real-time), and reaches maximum after exactly 280 in-game days (or one real-time week)." 
                />
                <p>You can hover over the name of the attribute for more details</p>
                <div className="wine-score">
                    <h2>Score <Tooltip maxWidth={500} content={<>
                        <p>Score is calculated using the following formula</p>
                        <p className="italic formula-text">Score = (Purity+Acidity+Freshness+Age) * (lowest value between Purity, Acidity, Freshness, and Age) * 5</p>
                        </>}>(?)</Tooltip></h2>
                    
                        <div className="wine-score-value">
                            {calculateWineScore()}
                        </div>
                    
                </div>

                <div className="score-details">
                    <p>Wine score requirements</p>
                    <ul>
                        <li style={{ opacity: scoreIsAboveValue(60000) ? "1" : "0.3"}}>60000</li>
                        <li style={{ opacity: scoreIsAboveValue(120000) ? "1" : "0.3"}}>120000</li>
                        <li style={{ opacity: scoreIsAboveValue(160000) ? "1" : "0.3"}}>160000</li>
                    </ul>
                    <p>A minimum of 60,000 score is required for Glyph Lore <span>Rank 3</span> and <span>Rank 2</span></p>
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