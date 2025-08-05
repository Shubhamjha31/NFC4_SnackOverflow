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
      details: "This program provides comprehensive knowledge in algorithms, data structures, and software development..."
    },
    {
      id: 2345,
      title: "Business Administration",
      shortDescription: "Master of Business Administration",
      details: "Advanced business concepts with focus on leadership, finance, and strategic management..."
    },
    {
      id: 3456,
      title: "Business Administration",
      shortDescription: "Master of Business Administration",
      details: "Advanced business concepts with focus on leadership, finance, and strategic management..."
    },
    {
      id: 4567,
      title: "Business Administration",
      shortDescription: "Master of Business Administration",
      details: "Advanced business concepts with focus on leadership, finance, and strategic management..."
    },
    {
      id: 5678,
      title: "Business Administration",
      shortDescription: "Master of Business Administration",
      details: "Advanced business concepts with focus on leadership, finance, and strategic management..."
    },
    
    // Add more degrees as needed
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
      <h2 className="subheading">Degrees</h2>
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