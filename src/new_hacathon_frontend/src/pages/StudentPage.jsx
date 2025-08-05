import * as React from "react";
import DegreeDisplay from "../components/studentPage/DegreeDisplay";
import "../styles/studentPage.scss"
function StudentPage() {
    return (
        <div className="student-page">
            <h1>Student Portal</h1>
            <div className="student-info">
                <img className="student-image" src="/"></img>
                <div  className="student-info-text">
                    <h1 className="student-name">Name</h1>
                    <p className="student-bio">Bio</p>
                </div>
            </div>
            {/* Academic summary */}
            <div className="academic-summary"> </div>
            {/* Recent Activity */}
            <div className="recent-activity"></div>
            {/* Display degrees */}
            <div>
                <DegreeDisplay/>
            </div>

        </div>
    )
}

export default StudentPage;