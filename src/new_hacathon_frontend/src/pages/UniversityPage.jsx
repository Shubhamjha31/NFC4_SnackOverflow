import { useState, useEffect } from 'react';
import "../styles/universityPage.scss";
import { institutes } from '../../../declarations/institutes';
import { Principal } from "@dfinity/principal"
function UniversityPage() {
  const [uniData, setUniData] = useState({});
  const [totalCreds, setTotalCreds] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // Form state for adding credential
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

  // Fetch initial data
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

  // Map credentials to students list
  useEffect(() => {
    if (Array.isArray(totalCreds) && totalCreds.length > 0) {
      const mappedStudents = totalCreds.map((cred) => ({
        id: cred.id,
        studentId: cred.owner.toString(),
        owner: cred.owner,
        userCanisterId: cred.institute,
        dateIssued: new Date(Number(cred.issueDate) / 1_000_000).toLocaleDateString(),
        credential: cred.degree,
        status: cred.revoked ? "revoked" : "accepted",
        image: cred.image
      }));
      setStudents(mappedStudents);
    }
  }, [totalCreds]);

  // Handle revoke action
  const handleRevoke = async (student) => {
    if (!window.confirm(`Are you sure you want to revoke ${student.credential} for ${student.studentId}?`)) {
      return;
    }
    try {
      await institutes.revokeCredential(
        student.userCanisterId,
        student.owner,
        student.id
      );

      setStudents((prev) =>
        prev.map(s =>
          s.id === student.id ? { ...s, status: "revoked" } : s
        )
      );
    } catch (error) {
      console.error("Error revoking credential:", error);
    }
  };

  // Handle adding new credential
  const handleAddCredential = async () => {
    try {
      const expiryValue = newCredential.expiry ? [Number(newCredential.expiry)] : [];
      const result = await institutes.issueCredential(
        Principal.fromText(newCredential.userCanisterId), // user canister ID
  Principal.fromText(newCredential.owner),   
        newCredential.degree,
        newCredential.image,
        expiryValue.length > 0 ? expiryValue : []
      );

      if ("ok" in result) {
        const cred = result.ok;
        const newStudent = {
          id: cred.id,
          studentId: cred.owner.toString(),
          owner: cred.owner,
          userCanisterId: cred.institute,
          dateIssued: new Date(Number(cred.issueDate) / 1_000_000).toLocaleDateString(),
          credential: cred.degree,
          status: cred.revoked ? "revoked" : "accepted",
          image: cred.image
        };
        setStudents((prev) => [...prev, newStudent]); // 🔹 Update memory instantly
        setShowAddForm(false);
        setNewCredential({ userCanisterId: "", owner: "", degree: "", image: "", expiry: "" });
      } else {
        console.error("Error issuing credential:", result.err);
      }
    } catch (error) {
      console.error("Error issuing credential:", error);
    }
  };

  // Filter students for search
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
          <input
            type="text"
            placeholder="User Canister ID"
            value={newCredential.userCanisterId}
            onChange={(e) => setNewCredential({ ...newCredential, userCanisterId: e.target.value })}
          />
          <input
            type="text"
            placeholder="Owner Principal"
            value={newCredential.owner}
            onChange={(e) => setNewCredential({ ...newCredential, owner: e.target.value })}
          />
          <input
            type="text"
            placeholder="Degree"
            value={newCredential.degree}
            onChange={(e) => setNewCredential({ ...newCredential, degree: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newCredential.image}
            onChange={(e) => setNewCredential({ ...newCredential, image: e.target.value })}
          />
          <input
            type="number"
            placeholder="Expiry (timestamp, optional)"
            value={newCredential.expiry}
            onChange={(e) => setNewCredential({ ...newCredential, expiry: e.target.value })}
          />
          <button onClick={handleAddCredential} className="action-btn approve-btn">Submit</button>
          <button onClick={() => setShowAddForm(false)} className="action-btn reject-btn">Cancel</button>
        </div>
      )}

      <div className="admin-profile">
        {uniData?.logo && (
          <img src={uniData.logo} alt="Admin Profile" className="admin-avatar" />
        )}
        <div className="admin-info">
          <h2>{uniData?.name || "Loading..."}</h2>
        </div>
      </div>

      <div className="credentials-card">
        <h2>Student Credentials Management</h2>
        <p>View and manage all credentials issued to students</p>

        <input
          type="text"
          placeholder="Search students..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
                    <button
                      className="action-btn reject-btn"
                      onClick={() => handleRevoke(student)}
                    >
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
