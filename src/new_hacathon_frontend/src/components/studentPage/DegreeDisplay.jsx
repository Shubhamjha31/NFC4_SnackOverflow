import { useState } from 'react';
import DegreePopup from './DegreePopup';
import DegreeCard from './DegreeCard';
const DegreeDisplay = () => {
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  // Sample degree data - replace with your actual data
 const degrees = [
  {
    id: 1234,
    title: "Computer Science",
    shortDescription: "Bachelor of Science in Computer Science",
    details: "This program provides comprehensive knowledge in algorithms, data structures, and software development...",
    owner: "Alex Johnson",
    issuerID: "TVU-CS-2023-001",
    issueDate: "15/05/2023",
    image: "/degree-icons/computer-science.png",
    expiry: "15/05/2028"
  },
  {
    id: 2345,
    title: "Business Administration",
    shortDescription: "Master of Business Administration",
    details: "Advanced business concepts with focus on leadership, finance, and strategic management...",
    owner: "Maria Garcia",
    issuerID: "TVU-MBA-2023-045",
    issueDate: "18/05/2023",
    image: "/degree-icons/business-admin.png",
    expiry: "18/05/2026"
  },
  {
    id: 3456,
    title: "Data Science",
    shortDescription: "Master of Science in Data Science",
    details: "Comprehensive training in machine learning, statistical analysis, and big data technologies...",
    owner: "James Wilson",
    issuerID: "TVU-DS-2023-012",
    issueDate: "22/06/2023",
    image: "/degree-icons/data-science.png",
    expiry: "22/06/2028"
  },
  {
    id: 4567,
    title: "Electrical Engineering",
    shortDescription: "Bachelor of Engineering in Electrical",
    details: "Fundamentals of circuit design, power systems, and electronic devices...",
    owner: "Priya Patel",
    issuerID: "TVU-EE-2023-078",
    issueDate: "10/07/2023",
    image: "/degree-icons/electrical-eng.png",
    expiry: "10/07/2030"
  },
  {
    id: 5678,
    title: "Graphic Design",
    shortDescription: "Bachelor of Fine Arts in Graphic Design",
    details: "Creative visual communication through typography, illustration, and digital media...",
    owner: "David Kim",
    issuerID: "TVU-GD-2023-033",
    issueDate: "05/08/2023",
    image: "/degree-icons/graphic-design.png",
    expiry: "05/08/2027"
  },
  {
    id: 6789,
    title: "Medicine",
    shortDescription: "Doctor of Medicine",
    details: "Comprehensive medical training with clinical rotations and research components...",
    owner: "Emma Williams",
    issuerID: "TVU-MD-2023-009",
    issueDate: "30/09/2023",
    image: "/degree-icons/medicine.png",
    expiry: "30/09/2033"
  },
  {
    id: 7890,
    title: "Environmental Science",
    shortDescription: "Bachelor of Science in Environmental Science",
    details: "Study of ecological systems, conservation, and sustainable development...",
    owner: "Liam Brown",
    issuerID: "TVU-ES-2023-021",
    issueDate: "12/10/2023",
    image: "/degree-icons/environmental-sci.png",
    expiry: "12/10/2028"
  }
];


  const handleViewDetails = (degree) => {
    setSelectedDegree(degree);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedDegree(null);
  };

  return (
    <div className="degree-div">
      <h2 className="subheading">Credentials</h2>
      <div className="degree-grid">
        {degrees.map((degree) => (
          <DegreeCard
            key={degree.id}
            degree={degree}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
      
      {showPopup && selectedDegree && (
        <DegreePopup degree={selectedDegree} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default DegreeDisplay;