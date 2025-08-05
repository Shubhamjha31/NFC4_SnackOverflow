import { useState } from 'react';
import "../styles/universityPage.scss"

function UniversityPage() {
  
  // University admin data
  const [adminData] = useState({
    name: "XYZ University",
    bio: "University of XYZ, founded in 1994, accrediated A+, ISO certified.",
    avatar: "/"
  });

  // Dummy student credentials data
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Alex Chen",
      studentId: "TVU2023001",
      credential: "Bachelor of Computer Science",
      dateIssued: "2023-05-15",
      status: "approved",
      email: "alex.chen@student.tvu.edu"
    },
    {
      id: 2,
      name: "Maria Garcia",
      studentId: "TVU2023002",
      credential: "Master of Data Science",
      dateIssued: "2023-05-18",
      status: "approved",
      email: "maria.garcia@student.tvu.edu"
    },
    {
      id: 3,
      name: "James Wilson",
      studentId: "TVU2023003",
      credential: "PhD in Artificial Intelligence",
      dateIssued: "2023-06-02",
      status: "pending",
      email: "james.wilson@student.tvu.edu"
    },
    {
      id: 4,
      name: "Priya Patel",
      studentId: "TVU2023004",
      credential: "Bachelor of Software Engineering",
      dateIssued: "2023-06-10",
      status: "approved",
      email: "priya.patel@student.tvu.edu"
    },
    {
      id: 5,
      name: "David Kim",
      studentId: "TVU2023005",
      credential: "Master of Cybersecurity",
      dateIssued: "2023-06-12",
      status: "rejected",
      email: "david.kim@student.tvu.edu"
    },
    {
      id: 6,
      name: "Emma Williams",
      studentId: "TVU2023006",
      credential: "Bachelor of Computer Science",
      dateIssued: "2023-06-15",
      status: "pending",
      email: "emma.williams@student.tvu.edu"
    },
    {
      id: 7,
      name: "Liam Brown",
      studentId: "TVU2023007",
      credential: "Master of Computer Science",
      dateIssued: "2023-06-20",
      status: "approved",
      email: "liam.brown@student.tvu.edu"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // Handle credential approval/rejection
  const handleStatusChange = (id, newStatus) => {
    setStudents(students.map(student => 
      student.id === id ? { ...student, status: newStatus } : student
    ));
  };

  // Filter students based on search term
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.credential.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="university-dashboard">
      <div className="admin-header">
        <h1>University Admin Dashboard</h1>
      </div>

      <div className="admin-profile">
        <img 
          src={adminData.avatar} 
          alt="Admin Profile" 
          className="admin-avatar" 
        />
        <div className="admin-info">
          <h2>{adminData.name}</h2>
          <p>{adminData.bio}</p>
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
              <th>Student Name</th>
              <th>Student ID</th>
              <th>Credential</th>
              <th>Date Issued</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map(student => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.studentId}</td>
                <td>{student.credential}</td>
                <td>{student.dateIssued}</td>
                <td className={`status-${student.status}`}>
                  {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                </td>
                <td>
                  {student.status === "pending" && (
                    <>
                      <button 
                        className="action-btn approve-btn"
                        onClick={() => handleStatusChange(student.id, "approved")}
                      >
                        Approve
                      </button>
                      <button 
                        className="action-btn reject-btn"
                        onClick={() => handleStatusChange(student.id, "rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

}

export default UniversityPage;



