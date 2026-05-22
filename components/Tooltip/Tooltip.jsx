import "./Tooltip.css"
import {useState} from "react"

export default function Tooltip({children, content, maxWidth}){
    const [visible, setVisible] = useState(false)

    return (
        <div className="tooltip"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            
            {visible && 
                <div className="tooltip-body"
                    style={maxWidth ? {maxWidth: maxWidth} : undefined}>
                    {content}
                </div>
            }
        </div>
    )
}