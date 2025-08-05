import * as React from "react";
import DegreeDisplay from "../components/studentPage/DegreeDisplay";
import Notifier from "../components/studentPage/Notifier";
import "../styles/studentPage.scss"

function StudentPage() {
    return (
        <div className="student-page">
            <Notifier
                isUserLoggedIn={false}
                isUserGrantedAccess={false} />
            <div className="student-info">
                <img className="student-image" src="/"></img>
                <div className="student-info-text">
                    <h1 className="student-name">Shubham Jha</h1>
                    <p className="student-bio">The company itself is a very successful company. What repulses those who praise him, what will happen to the suffering of those who are present, will I make some opening to the wise? Having said that, the trouble with the great hatred of the offices itself will turn out to be beneficial to some!</p>
                </div>
            </div>

            <div className="activity-summary-log">
                {/* Academic summary */}
                <div className="academic-summary">
                    <h3 className="subheading">Academic Summary</h3>
                    <p>Shubham Jha earned a B.Sc in Computer Science (TVU-CS-2023-001) on 15/05/2023. Maria Garcia completed an MBA (TVU-MBA-2023-045) on 18/05/2023. James Wilson holds an M.Sc in Data Science (TVU-DS-2023-012). All credentials are blockchain-verified.</p>
                </div>
                {/* Recent Activity */}
                <div className="recent-activity">
                    <h3 className="subheading">Recent Activity</h3>
                    <ul><li>15/05/2023 - Issued B.Sc Computer Science to Alex Johnson</li>
                        <li>18/05/2023 - MBA credential viewed by employer</li>
                        <li>22/06/2023 - M.Sc Data Science shared on LinkedIn</li>
                        <li>10/07/2023 - B.Eng Electrical expired (10-year validity ended)</li></ul>
                </div>
            </div>
            {/* Display degrees */}
            <div>
                <DegreeDisplay />
            </div>

        </div>
    )
}

export default StudentPage;