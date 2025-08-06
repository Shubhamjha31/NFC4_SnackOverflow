import { useState, useEffect } from "react";
import DegreeDisplay from "../components/studentPage/DegreeDisplay";
import Notifier from "../components/studentPage/Notifier";
import "../styles/studentPage.scss";
import { institutes } from "../../../declarations/institutes";
import { simpleFraudCheck } from "../utils/fraudChecker";

function StudentPage() {
  const [credentials, setCredentials] = useState([]);
  const [fraudStatus, setFraudStatus] = useState({ verdict: "legit", reason: "" });

  async function getAllCreds() {
    try {
      const creds = await institutes.getAllCredentials();
      const mapped = creds.map((cred) => ({
        id: cred.id,
        title: cred.degree,
        shortDescription: cred.degree,
        details: `Issued by ${cred.institute.toString()} on ${new Date(Number(cred.issueDate) / 1_000_000).toLocaleDateString()}`,
        owner: cred.owner.toString(),
        issuerID: cred.institute.toString(),
        issueDate: new Date(Number(cred.issueDate) / 1_000_000).toLocaleDateString(),
        expiry: cred.expiry ? new Date(Number(cred.expiry) / 1_000_000).toLocaleDateString() : "No Expiry",
        image: cred.image,
        revoked: cred.revoked
      }));
      setCredentials(mapped);

      // Run AI fraud check
      const fraudCheck = simpleFraudCheck(mapped);
      setFraudStatus(fraudCheck);

    } catch (err) {
      console.error("Error fetching credentials:", err);
    }
  }

  useEffect(() => {
    getAllCreds();
  }, []);

  return (
    <div className="student-page">
      <div className="blockchain-bg">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="blockchain-node"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`
            }}
          ></div>
        ))}
      </div>

      <Notifier isUserLoggedIn={true} isUserGrantedAccess={false} />

      {/* Fraud alert */}
      {fraudStatus.verdict === "fraud" && (
        <div className="fraud-alert">
          ⚠ FRAUD DETECTED: {fraudStatus.reason}
        </div>
      )}

      <div className="student-info">
        <img className="student-image" src="/" alt="Student" />
        <div className="student-info-text">
          <h1 className="student-name">Shubham Jha</h1>
          <p className="student-bio">
            The company itself is a very successful company...
          </p>
        </div>
      </div>

      <DegreeDisplay degrees={credentials} />
    </div>
  );
}

export default StudentPage;
