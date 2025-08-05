import * as React from "react";
import DegreeDisplay from "../components/studentPage/DegreeDisplay";
import "../styles/studentPage.scss"
function StudentPage() {
    return (
        <div className="student-page">
            <div className="student-info">
                <img className="student-image" src="/"></img>
                <div  className="student-info-text">
                    <h1 className="student-name">Name</h1>
                    <p className="student-bio">Bio</p>
                </div>
            </div>
           
           <div className="activity-summary-log">
            {/* Academic summary */}
            <div className="academic-summary"> 
                <h3 className="subheading">Academic Summary</h3>
            </div>
            {/* Recent Activity */}
            <div className="recent-activity">
                <h3 className="subheading">Recent Activity</h3>
            </div>
            </div>
            {/* Display degrees */}
            <div>
                <DegreeDisplay/>
            </div>

        </div>
    )
}

export default StudentPage;