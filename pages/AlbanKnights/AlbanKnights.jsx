import React from "react"
import { albanKnightStonesData as stonesData } from "./AlbanKnightsData"
import "./AlbanKnights.css"

export default function(){

    const [yellow, setYellow] = React.useState(null)
    const [red, setRed] = React.useState(null)
    const [green, setGreen] = React.useState(null)
    const [gray, setGray] = React.useState(null)
    const [blue, setBlue] = React.useState(null)

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

    function addAll(){
        const yellowValue = yellow?.value ? yellow.value : 0;
        const redValue = red?.value ? red.value : 0;
        const greenValue = green?.value ? green.value : 0;
        const grayValue = gray?.value ? gray.value : 0;
        const blueValue = blue?.value ? blue.value : 0;

        const sum = yellowValue + redValue + greenValue + grayValue + blueValue

        return sum
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

            return <li className="stone-item" onClick={() => addStone(stone)}>
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

    return (
        <div className="alban-knights-page">
            <div className="container">
                <h1>Alban Knights Training Stone Calculator</h1>

                <div>
                    <h3>Score Thresholds</h3>
                    <ul>
                        <li>
                            SS 190+
                        </li>
                        <li>
                            
                            S 130+
                        </li>
                        <li>
                            A 100+
                        </li>
                        <li>
                            B 70+
                        </li>
                        <li>
                            C Below 70
                        </li>
                    </ul>
                </div>

                <div>
                    <h2>{getTier(addAll())}</h2>
                    <h2>{addAll()}</h2>
                </div>

                <p>Click on an item in the list to add them to the slot.</p>
                <div className="stones-container">
                    <div className="yellow-container">
                        <p className="stone-active-value">{yellow?.value ? yellow.value : 0}</p>
                        <div onClick={() => setYellow(null)} className="stone-active-slot">{yellow?.name ? yellow.name : "Empty"}</div>
                        {renderStones("yellow")}
                    </div>

                    <div className="red-container">
                        <p className="stone-active-value">{red?.value ? red.value : 0}</p>
                        <div onClick={() => setRed(null)} className="stone-active-slot">{red?.name ? red.name : "Empty"}</div>
                        {renderStones("red")}
                    </div>

                    <div className="green-container">
                        <p className="stone-active-value">{green?.value ? green.value : 0}</p>
                        <div onClick={() => setGreen(null)} className="stone-active-slot">{green?.name ? green.name : "Empty"}</div>
                        {renderStones("green")}
                    </div>

                    <div className="gray-container">
                        <p className="stone-active-value">{gray?.value ? gray.value : 0}</p>
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