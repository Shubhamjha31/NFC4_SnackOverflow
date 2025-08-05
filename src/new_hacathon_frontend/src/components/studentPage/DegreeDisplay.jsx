import * as React from "react";

const degrees = ["Degree 1", "Degree 2", "Degree 3", "Degree 4"]

function DegreeDisplay() {
    return (
        <div className="degree-div">
            <ul className="degree-list">
                {degrees.map((degree, index) => (
                    <li className="degree-individual" key={index}>{degree}</li>
                ))}
            </ul>
        </div>

    )
}

export default DegreeDisplay;