const DegreeCard = ({ degree, onViewDetails }) => {
  return (
    <div className="degree-individual">
      {degree.image && (
        <img
          src={degree.image}
          alt={degree.title}
          className="degree-image"
        />
      )}
      <h3>{degree.title}</h3>
      <p>{degree.shortDescription}</p>
      <p className={degree.revoked ? "status-revoked" : "status-accepted"}>
        {degree.revoked ? "Revoked" : "Valid"}
      </p>
      <button
        className="degree-button"
        onClick={() => onViewDetails(degree)}
      >
        View Details
      </button>
    </div>
  );
};

export default DegreeCard;
