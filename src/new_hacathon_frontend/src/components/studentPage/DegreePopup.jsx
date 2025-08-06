const DegreePopup = ({ degree, onClose }) => {
  return (
    <div className="popup-overlay active" onClick={onClose}>
      <div
        className="popup-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-popup" onClick={onClose}>
          &times;
        </button>
        <div id="popupDetails">
          <h2>Name: {degree.title}</h2>
          <p>Description: {degree.details}</p>
          <p>Credential ID: {degree.id}</p>
          <p>Owner: {degree.owner}</p>
          <p>Issuer ID: {degree.issuerID}</p>
          <p>Issue Date: {degree.issueDate}</p>
          <p>Expiry: {degree.expiry}</p>
          <p>Status: {degree.revoked ? "Revoked" : "Valid"}</p>
        </div>
      </div>
    </div>
  );
};

export default DegreePopup;
