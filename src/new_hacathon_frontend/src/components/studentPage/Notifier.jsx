import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEye, faShield } from '@fortawesome/free-solid-svg-icons';

const Notifier = ({ isUserLoggedIn, isUserGrantedAccess }) => {
  return (
    <div className="notifier">
      {/* Shield icon */}
      {!isUserGrantedAccess && !isUserLoggedIn && (
        <FontAwesomeIcon
          className="faicon"
          style={{ color: '#3e3e40ff', fontSize: '18px' }}
          icon={faShield}
        />
      )}

      {/* "Maa ki aakh" icon */}
      {isUserGrantedAccess && (
        <FontAwesomeIcon
          className="faicon"
          style={{ color: 'black', fontSize: '18px' }}
          icon={faEye}
        />
      )}

      {/* Bell icon */}
      {isUserLoggedIn && (
        <FontAwesomeIcon
          className="faicon"
          style={{ color: 'black', fontSize: '18px' }}
          icon={faBell}
        />
      )}
    </div>
  );
};

export default Notifier;
