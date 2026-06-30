
// segments is an array of values/numbers
export default function RatioBar({segments = [1]}){

    return (<div className="ratio-bar-component">
        {segments.map(segment => {
            <div className="ratio-bar-segment"></div>
        })}
    </div>)
}