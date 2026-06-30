import React from "react"
import "./MeterThreshold.css"
import { toPercent } from "../../src/utils/utils"

/**
 * Displays a segmented threshold meter
 * 
 *  mainValue is the value you're comparing
 *  maxValue is how high the gauge should max at, can be left blank
 *  minLabel is for gauges that have a threshold below the first value of the segment array, can be left blank
 * 
 *  segments prop should be used for segmented segment sizes
 *  thresholds prop should be used for cumulative segment sizes
 * 
 * eg
 *  -   segments={[25, 25, 25, 25]}
 *      -   Divides each segment equally by their own value up to 100
 *  -   thresholds={[25, 50, 75, 100]}
 *      -   Divides each segment progressively up to 100
 * 
 * Use one or the other depending on your needs
 * 
 */



export default function MeterThreshold({mainValue = 0, minLabel, segments, thresholds, segmentNames, maxValue, width, maxWidth, backgroundColor}){

    let meterSegments = []
    let meterLabels = []
    
    // Adds maxValue to segments if applicable
    function pushMaxValueToMeterSegments(){
        if (maxValue !== undefined){
            const totalSegmentValue = meterSegments.reduce((acc, curr) => acc + curr, 0)
            if (totalSegmentValue < maxValue){
                meterSegments.push(maxValue - totalSegmentValue)
            }
            else{
                console.warn("Warning: maxValue passed to MeterThreshold component is less than the combined sum of segments.")
            }
        }
    }

    function getMax(){
        const totalSegmentValue = meterSegments.reduce((acc, curr) => acc + curr, 0)
        if (maxValue !== undefined){
            return Math.max(totalSegmentValue, maxValue)
        }
        
        return totalSegmentValue
    }

    if (minLabel){
        meterLabels.push(minLabel)
    }

    if (segments !== undefined){
        if (Array.isArray(segments)){
            meterSegments = [...segments.value]
            meterLabels.push(...segments.label)
            pushMaxValueToMeterSegments()
        }
        else{
            throw new Error ("segments prop must be an Array.");
        }
    }
    else if (thresholds !== undefined){
        if (Array.isArray(thresholds)){
            meterSegments = thresholds.map((threshold, index, arr) => {
                if (index === 0) return threshold.value
                const previous = arr[index-1]

                // Maybe add a warning if the user passed in an array that doesn't step up sequentially
                if (threshold.value - previous.value <= 0){
                    console.warn("Warning: array passed to MeterThreshold component does not increment sequentially.")
                }
                return threshold.value - previous.value;
            })
            pushMaxValueToMeterSegments()
            meterLabels.push(...thresholds.map(threshold => threshold.label))
        }
        else{
            throw new Error ("thresholds prop must be an Array.");
        }
    }else{
        // Throw error if for some reason segments and thresholds is not defined
        throw new Error ("Array must be passed to either the segments prop or thresholds prop");
    }

    const meterThresholds = meterSegments.reduce((acc, curr) =>{
        const last = acc.length ? acc[acc.length - 1] : 0
        acc.push(last + curr)
        return acc
    }, [])

    const useMinLabel = minLabel ? true: false

    return (
        <div className="threshold-meter-component" style={{width : width, maxWidth : maxWidth}}>
            <div className="meter-segments-wrapper">
                {meterSegments.map((segment, index) => {
                    return <div key={index} className={`segment ${mainValue < meterThresholds[index-(useMinLabel ? 1 : 0)] ? "fade":""}`} style={{flex: segment}}><p>{meterLabels[index]}</p></div>
                })}
            </div>
            <div className="meter-segments-dividers-wrapper">
                {meterSegments.map((segment, index) => {
                    return <div key={index} className="divider" style={{flex: segment}}></div>
                })}
            </div>
            <div className="meter-main" style={{width : toPercent(mainValue, getMax() ), backgroundColor : backgroundColor}}></div>
        </div>
    )
}