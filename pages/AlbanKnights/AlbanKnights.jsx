import React from "react"
import { albanKnightStonesData as stonesData } from "./AlbanKnightsData"
import "./AlbanKnights.css"
import { toPercent } from "../../src/utils/utils"

import MeterThreshold from "../../components/MeterThreshold/MeterThreshold"

export default function(){

        // NOTE: hardcoded value
    const highestStones = {
        yellow: 130,
        red: 0,
        green: 45,
        gray: 45,

        getMax() {
            return (this.yellow + this.red + this.green + this.gray)
        }
        
    }

    const [yellow, setYellow] = React.useState(null)
    const [red, setRed] = React.useState(null)
    const [green, setGreen] = React.useState(null)
    const [gray, setGray] = React.useState(null)
    const [blue, setBlue] = React.useState(null)

    const [targetScore, setTargetScore] = React.useState(0)

    function getStoneByName(name)
    {
        const stone = stonesData.find(stone => stone.name === name)
        return stone
    }

    // Might want to use memo this
    const trainingStoneData = Object.groupBy(stonesData, ({color}) => color)

    // console.log(getStoneByName("Difficulty: Heroic"))

    function getTier(value){
        const points = Number(value)

        if (points >= 190){
            return "SS"
        }
        else if (points >= 130){
            return "S"
        }
        else if (points >= 100){
            return "A"
        }
        else if (points >= 70){
            return "B"
        }
        else{
            return "C"
        }
    }

    // Gets current score
    function addAll(){
        const yellowValue = yellow?.value ? yellow.value : 0;
        const redValue = red?.value ? red.value : 0;
        const greenValue = green?.value ? green.value : 0;
        const grayValue = gray?.value ? gray.value : 0;
        const blueValue = blue?.value ? blue.value : 0;

        const sum = yellowValue + redValue + greenValue + grayValue + blueValue

        return sum
    }

    function isTargetScoreMet(){
        return addAll() >= targetScore
    }

    function showList(color){
        console.log("running function")


        if (color === "yellow"){
            console.log(trainingStoneData.yellow)
        }
        else if (color === "red"){
            console.log(trainingStoneData.red)
        }
        else if (color === "green"){
            console.log(trainingStoneData.green)
        }
    }

    function renderStones(color)
    {
        // Yeah I know this function isn't fully optimized. I'll do that later if its an issue
        let colorData = null

        if (color === "yellow"){
            colorData = trainingStoneData.yellow
        }
        else if (color === "red"){
            colorData = trainingStoneData.red
        }
        else if (color === "green"){
            colorData = trainingStoneData.green
        }
        else if (color === "gray"){
            colorData = trainingStoneData.gray
        }
        else if (color === "blue"){
            colorData = trainingStoneData.blue
        }
        else{
            console.log("Invalid Stone Color")
            return null
        }

        // sort by ascending
        colorData.sort((a, b) => (b.value - a.value))


        const elements = colorData.map((stone) => {

            let plusminusClass = null

            if (stone.value > 0)
            {
                plusminusClass = "positive"
            }
            if (stone.value < 0){
                plusminusClass = "negative"
            }

            // And I need some keys here
            const meetsScoreReq = isTargetScorePossibleWithStone(stone)
            //want to add something t check current slotted stone
            // const currentlySlotted = 

            return <li className={`stone-item ${meetsScoreReq ? "" : "fade"}`} onClick={() => addStone(stone)}>
                <div className={`stone-value ${plusminusClass}`}>{plusminusClass === "positive" ? "+":null}{stone.value}</div> 
                <div className="stone-name">{stone.name}</div>
                </li>
        })

        return elements
    }

    function addStone(stone){
        if (stone.color === "yellow")
        {
            setYellow(stone)
        }
        else if (stone.color === "red")
        {
            setRed(stone)
        }
        else if (stone.color === "green")
        {
            setGreen(stone)
        }
        else if (stone.color === "gray")
        {
            setGray(stone)
        }
        else if (stone.color === "blue")
        {
            setBlue(stone)
        }
    }

    function isTargetScorePossibleWithStone(stone){

        const highestStonesCopy = {...highestStones}

        if (!targetScore){
            return true
        }

        const {value, color} = stone

        //use slotted stones as value if they exist
        if (yellow){
            highestStonesCopy.yellow = yellow.value
        }
        if (red){
            highestStonesCopy.red = red.value
        }
        if (green){
            highestStonesCopy.green = green.value
        }
        if (gray){
            highestStonesCopy.gray = gray.value
        }

        // Replace value with current stone colors value for calculations
        if (color === "yellow"){
            highestStonesCopy.yellow = value
        }
        if (color === "red"){
            highestStonesCopy.red = value
        }
        if (color === "green"){
            highestStonesCopy.green = value
        }
        if (color === "gray"){
            highestStonesCopy.gray = value
        }

        const selectValue = highestStonesCopy.red + highestStonesCopy.yellow + highestStonesCopy.green + highestStonesCopy.gray

        if (selectValue >= targetScore){
            return true
        }

        return false
    }

    return (
        <div className="alban-knights-page">
            <div className="container">
                <h1>Alban Knights Training Stone Calculator</h1>

                <div>
                    <h3>Select Target Reward Tier</h3>
                    <ul className="alban-target-score-wrapper">
                        <li>
                            <button className={`style-btn-cute ${targetScore >= 190 ? "selected" : undefined}`} onClick={()=>setTargetScore(190)}>
                                <span className="alban-target-rank">SS</span>
                                <span>190+</span>
                            </button>
                        </li>
                        <li>
                            <button className={`style-btn-cute ${targetScore === 130 ? "selected" : undefined}`} onClick={()=>setTargetScore(130)}>
                                <span className="alban-target-rank">S</span>
                                <span>130+</span>
                            </button>
                        </li>
                        <li>
                            <button className={`style-btn-cute ${targetScore === 100 ? "selected" : undefined}`} onClick={()=>setTargetScore(100)}>
                                <span className="alban-target-rank">A</span>
                                <span>100+</span>
                            </button>
                        </li>
                        <li>
                            <button className={`style-btn-cute ${targetScore === 70 ? "selected" : undefined}`} onClick={()=>setTargetScore(70)}>
                                <span className="alban-target-rank">B</span>
                                <span>70+</span>
                            </button>
                        </li>
                        <li>
                            <button className={`style-btn-cute ${targetScore < 70 ? "selected" : undefined}`} onClick={()=>setTargetScore(0)}>
                                <span className="alban-target-rank">C</span>
                                <span>0-69</span>
                            </button>
                        </li>
                    </ul>
                </div>

                <MeterThreshold 
                    mainValue={addAll()} 
                    minLabel="C" 
                    thresholds={[{value: 70, label: "B"}, {value: 100, label: "A"}, {value: 130, label: "S"}, {value: 190, label: "SS"}]} 
                    maxValue={220}
                    maxWidth="500px"
                    backgroundColor={isTargetScoreMet() ? "#00ff00aa" : "#ff0000aa"}
                >
                </MeterThreshold>

                {/* Might be better to turn this into a reusable component and not hardcoded */}
                {/* <div className="meter-component">
                    <div className="meter-component-containers">
                        <div className="meter-component-current" style={{"width" : toPercent(addAll(), 220), "backgroundColor": isTargetScoreMet() ? "#00ff00aa" : "#ff0000aa"}}></div>
                        <div><p>C</p></div>
                        <div className={`${addAll() < 70 ? "fade" : ""}`}><p>B</p></div>
                        <div className={`${addAll() < 100 ? "fade" : ""}`}><p>A</p></div>
                        <div className={`${addAll() < 130 ? "fade" : ""}`}><p>S</p></div>
                        <div className={`${addAll() < 190 ? "fade" : ""}`}><p>SS</p></div>
                    </div>
                </div> */}

                <div className={`alban-knights-reward-container ${isTargetScoreMet() ? "" : "red"}`}>
                    <h3>Current Alban Knights Reward Tier</h3>
                    <div>
                        <h2>{getTier(addAll())}</h2>
                        <h3 className={`${isTargetScoreMet() ? "" : "red"}`}>{addAll()}</h3>
                    </div>
                </div>

                <div className="stones-value-wrapper">
                    <div>
                        <p>Yellow</p>
                        <p className="stone-active-value">{yellow?.value ? yellow.value : 0}</p>
                    </div>
                    <div>
                        <p>Red</p>
                        <p className="stone-active-value">{red?.value ? red.value : 0}</p></div>
                    <div>
                        <p>Green</p>
                        <p className="stone-active-value">{green?.value ? green.value : 0}</p>
                    </div>
                    <div>
                        <p>Gray</p>
                        <p className="stone-active-value">{gray?.value ? gray.value : 0}</p>
                    </div>
                </div>
                <p>Click on an item in the list to add them to the slot.</p>
                <p>Stones in the list will fade out if it is not possible to reach the set target tier.</p>

                
                <div className="stones-container">
                    <div className="yellow-container">
                        <div onClick={() => setYellow(null)} className="stone-active-slot">{yellow?.name ? yellow.name : "Empty"}</div>
                        {renderStones("yellow")}
                    </div>

                    <div className="red-container">
                        <div onClick={() => setRed(null)} className="stone-active-slot">{red?.name ? red.name : "Empty"}</div>
                        {renderStones("red")}
                    </div>

                    <div className="green-container">
                        <div onClick={() => setGreen(null)} className="stone-active-slot">{green?.name ? green.name : "Empty"}</div>
                        {renderStones("green")}
                    </div>

                    <div className="gray-container">
                        <div onClick={() => setGray(null)} className="stone-active-slot">{gray?.name ? gray.name : "Empty"}</div>
                        
                        {renderStones("gray")}
                    </div>
                </div>

                <div className="stones-List">

                </div>
            </div>
        </div>
        
    )
}