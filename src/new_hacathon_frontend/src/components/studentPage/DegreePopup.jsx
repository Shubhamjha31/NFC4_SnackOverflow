import * as React from "react";


const DegreePopup = ({ degree, onClose }) => {
  return (
    <div className="popup-overlay active" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-popup" onClick={onClose}>
          &times;
        </button>
        <div id="popupDetails">
          <h2>{degree.title}</h2>
          <p>{degree.details}</p>
          <p> {degree.id}</p>
          <p>Issue date: 01/01/01</p>
          <p>Issued by: XYZ</p>
          {/* Add more degree details here */}
        </div>
      </div>
    </div>
  );
};

export default DegreePopup;