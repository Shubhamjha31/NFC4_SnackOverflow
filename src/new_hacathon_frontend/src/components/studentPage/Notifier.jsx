import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEye, faShield } from '@fortawesome/free-solid-svg-icons';
import { useState, useRef, useEffect } from 'react';
import NotifPopup from '../NotifPopup';

const Notifier = ({ isUserLoggedIn, isUserGrantedAccess }) => {
  const [notifPopup, setNotifPopup] = useState(false);
  const popupRef = useRef(null);

  // Sample notification data
  const notifications = [
    { id: 1, text: "New credential issued: B.Sc Computer Science", time: "2 hours ago" },
    { id: 2, text: "Your MBA credential was viewed by an employer", time: "1 day ago" },
    { id: 3, text: "System maintenance scheduled for tomorrow", time: "2 days ago" }
  ];

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setNotifPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleNotifIconClick = () => {
    setNotifPopup(!notifPopup);
  };

  return (
    <div className="notifier" ref={popupRef}>
      {/* Shield icon */}
      {!isUserGrantedAccess && !isUserLoggedIn && (
        <div className="icon-container">
          <FontAwesomeIcon
            onClick={handleNotifIconClick}
            className="faicon"
            icon={faShield}
          />
        </div>
      )}

      {/* Eye icon */}
      {isUserGrantedAccess && (
        <div className="icon-container">
          <FontAwesomeIcon
            onClick={handleNotifIconClick}
            className="faicon"
            icon={faEye}
          />
        </div>
      )}

      {/* Bell icon */}
      {isUserLoggedIn && (
        <div className="icon-container">
          <FontAwesomeIcon
            onClick={handleNotifIconClick}
            className="faicon"
            icon={faBell}
          />
          <span className="notification-badge">{notifications.length}</span>
        </div>
      )}

      {/* Notification Popup - using your existing NotifPopup component */}
      <NotifPopup notifPopup={notifPopup} setNotifPopup={setNotifPopup} notifications={notifications} />
    </div>
  );
};

export default Notifier;