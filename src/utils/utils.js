//  Takes 2 values and returns value as a number.
export function calcPercent(value, maxValue){
    if (maxValue === 0){
        throw new Error ("maxValue cannot be 0.")
    }

    return (Number(value) / Number(maxValue) *100)
}

//  Takes 2 values and returns value as a string.
export function toPercent(value, maxValue){
    if (maxValue === 0){
        throw new Error ("maxValue cannot be 0.")
    }

    return String(Number(value) / Number(maxValue) *100) + "%"
}