import React from "react"
import { Link } from "react-router-dom"

export default function NotFound(){
    return (
        
        <div className="not-found-page">
            
            <h1>404 Page not found</h1>
            <h2>OMG???</h2>
            <p>You found nothing...</p>
            <Link to="..">Click here</Link> to go back to the past before this crazy conumdrum occured.
        </div>
    
    )
}