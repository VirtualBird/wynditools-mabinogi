import React from "react"
import Tooltip from "../../../components/Tooltip/Tooltip"
import "./Slider.css"

export default function Slider({name, value, handleChange, tooltip}){

    // Perhaps add code to disable text selection when dragging?
    return (
        <div className="slider-container">
            {tooltip ? 
                <Tooltip content={tooltip}>
                    <p className="name">{name}</p>
                </Tooltip>
            :
                <p className="name">{name}</p>
            }
            <p className="value">{value}</p>
            <input 
                type="range" 
                min="0" 
                max="100" 
                className="slider wine-acidity"
                name={name}
                value={value}
                onInput={event => handleChange(event)}/>
        </div>
    )
}