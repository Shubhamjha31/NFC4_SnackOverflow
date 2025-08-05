const DegreeCard = ({ degree, onViewDetails }) => {
  return (
    <div className="degree-individual">
      <h3>{degree.title}</h3>
      <p>{degree.shortDescription}</p>
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