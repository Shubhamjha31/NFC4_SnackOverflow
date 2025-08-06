import { useState, useEffect } from 'react';
import "../styles/universityPage.scss";
import { institutes } from '../../../declarations/institutes';
import { Principal } from "@dfinity/principal";

// 🔹 Dummy AI fraud detection function (replace with Ollama later)
async function checkFraudRules(uniData, issuedCount) {
  const threshold = 100;
  if (issuedCount > threshold) {
    return { verdict: "fraud", reason: `Issued ${issuedCount} credentials/hour (> ${threshold})` };
  }
  return { verdict: "legit", reason: `Normal activity: ${issuedCount} credentials/hour` };
}

function UniversityPage() {
  const [uniData, setUniData] = useState({});
  const [totalCreds, setTotalCreds] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const [newCredential, setNewCredential] = useState({
    userCanisterId: "",
    owner: "",
    degree: "",
    image: "",
    expiry: ""
  });

  // Fetch university info
  async function getUniData() {
    return await institutes.getInstituteInfo();
  }

  // Fetch all credentials
  async function getAllCreds() {
    return await institutes.getAllCredentials();
  }

  // Initial fetch
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await getUniData();
        setUniData(result);

        const creds = await getAllCreds();
        setTotalCreds(creds);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchData();
  }, []);

  // Map credentials into student table format
  useEffect(() => {
    if (Array.isArray(totalCreds)) {
      const mapped = totalCreds.map((cred) => ({
        id: cred.id,
        studentId: cred.owner.toString(),
        owner: cred.owner,
        userCanisterId: cred.institute.toString(),
        dateIssued: new Date(Number(cred.issueDate) / 1_000_000).toLocaleDateString(),
        credential: cred.degree,
        status: cred.revoked ? "revoked" : "accepted",
        image: cred.image
      }));
      setStudents(mapped);
    }
  }, [totalCreds]);

  // Handle revoke
  const handleRevoke = async (student) => {
    if (!window.confirm(`Revoke ${student.credential} for ${student.studentId}?`)) return;
    try {
      await institutes.revokeCredential(
        Principal.fromText(student.userCanisterId),
        Principal.fromText(student.owner),
        student.id
      );

      // Refresh list
      const creds = await getAllCreds();
      setTotalCreds(creds);
    } catch (error) {
      console.error("Error revoking credential:", error);
    }
  };

  // Handle adding new credential
  const handleAddCredential = async () => {
    // ✅ Validate Principals
    let userPrincipal, ownerPrincipal;
    try {
      userPrincipal = Principal.fromText(newCredential.userCanisterId);
      ownerPrincipal = Principal.fromText(newCredential.owner);
    } catch {
      alert("Invalid Principal format for User or Owner");
      return;
    }

    // ✅ Validate expiry
    const expiryValue = newCredential.expiry
      ? [Number(newCredential.expiry)]
      : [];
    if (expiryValue.length && isNaN(expiryValue[0])) {
      alert("Invalid expiry timestamp");
      return;
    }

    try {
      const result = await institutes.issueCredential(
        userPrincipal,
        ownerPrincipal,
        newCredential.degree,
        newCredential.image,
        expiryValue
      );

      if ("ok" in result) {
        // Refresh table from backend
        const creds = await getAllCreds();
        setTotalCreds(creds);
        setShowAddForm(false);
        setNewCredential({ userCanisterId: "", owner: "", degree: "", image: "", expiry: "" });

        // 🔹 Fraud detection after adding
        const issuedCount = creds.length;
        const fraudCheck = await checkFraudRules(uniData, issuedCount);
        console.log(`Fraud check verdict: ${fraudCheck.verdict} - ${fraudCheck.reason}`);
        if (fraudCheck.verdict === "fraud") {
          alert(`⚠ FRAUD DETECTED: ${fraudCheck.reason}`);
        }
      } else {
        console.error("Error issuing credential:", result.err);
      }
    } catch (error) {
      console.error("Error issuing credential:", error);
    }
  };

  // Filter table
  const filteredStudents = students.filter(student =>
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.credential.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="university-dashboard">
      <div className="admin-header">
        <h1>University Admin Dashboard</h1>
        <button className="action-btn approve-btn" onClick={() => setShowAddForm(true)}>
          Add Credential
        </button>
      </div>

      {showAddForm && (
        <div className="add-credential-form">
          <h3>Issue New Credential</h3>
          <input type="text" placeholder="User Canister ID"
            value={newCredential.userCanisterId}
            onChange={(e) => setNewCredential({ ...newCredential, userCanisterId: e.target.value })}
          />
          <input type="text" placeholder="Owner Principal"
            value={newCredential.owner}
            onChange={(e) => setNewCredential({ ...newCredential, owner: e.target.value })}
          />
          <input type="text" placeholder="Degree"
            value={newCredential.degree}
            onChange={(e) => setNewCredential({ ...newCredential, degree: e.target.value })}
          />
          <input type="text" placeholder="Image URL"
            value={newCredential.image}
            onChange={(e) => setNewCredential({ ...newCredential, image: e.target.value })}
          />
          <input type="number" placeholder="Expiry (timestamp, optional)"
            value={newCredential.expiry}
            onChange={(e) => setNewCredential({ ...newCredential, expiry: e.target.value })}
          />
          <button onClick={handleAddCredential} className="action-btn approve-btn">Submit</button>
          <button onClick={() => setShowAddForm(false)} className="action-btn reject-btn">Cancel</button>
        </div>
      )}

      <div className="admin-profile">

        <img src="/"  className="admin-avatar" />

        <div className="admin-info">
          <h2>{uniData?.name || "Loading..."}</h2>
        </div>
      </div>

      <div className="credentials-card">
        <h2>Student Credentials Management</h2>
        <p>View and manage all credentials issued to students</p>

        <input type="text" placeholder="Search students..." className="search-bar"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />

        <table className="credentials-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Credential</th>
              <th>Badge</th>
              <th>Date Issued</th>
              <th>Status</th>
              <th>Revoke</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td>{student.studentId}</td>
                <td>{student.credential}</td>
                <td><img src={student.image} alt={student.credential} height="40" /></td>
                <td>{student.dateIssued}</td>
                <td className={`status-${student.status}`}>
                  {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                </td>
                <td>
                  {student.status !== "revoked" && (
                    <button className="action-btn reject-btn" onClick={() => handleRevoke(student)}>
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UniversityPage;
