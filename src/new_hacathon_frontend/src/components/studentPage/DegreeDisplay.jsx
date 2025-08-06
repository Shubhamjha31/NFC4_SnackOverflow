import { useState } from "react";
import DegreePopup from "./DegreePopup";
import DegreeCard from "./DegreeCard";

const DegreeDisplay = ({ degrees }) => {
  const [selectedDegree, setSelectedDegree] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

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
        {degrees.length > 0 ? (
          degrees.map((degree) => (
            <DegreeCard
              key={degree.id}
              degree={degree}
              onViewDetails={handleViewDetails}
            />
          ))
        ) : (
          <p style={{ textAlign: "center", width: "100%" }}>
            No credentials found.
          </p>
        )}
      </div>

      {showPopup && selectedDegree && (
        <DegreePopup degree={selectedDegree} onClose={handleClosePopup} />
      )}
    </div>
  );
};

export default DegreeDisplay;
