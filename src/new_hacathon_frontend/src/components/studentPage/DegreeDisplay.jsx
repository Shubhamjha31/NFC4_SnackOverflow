import * as React from "react";

const degrees = ["Degree 1", "Degree 2", "Degree 3", "Degree 4","Degree 5"]

function DegreeDisplay() {
    return (
        <div className="degree-div">
            <h1>Degree List</h1>
        <div className="degree-grid">
                {degrees.map((degree, index) => (
                    <div className="degree-individual" key={index}>
                        <img src="/"></img>
                        <p>{degree}</p></div>
                ))}
           
        </div>
        </div>

    )
}

export default DegreeDisplay;