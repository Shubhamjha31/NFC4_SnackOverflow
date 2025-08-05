function NotifPopup({ notifPopup, setNotifPopup, notifications }) {
    if (!notifPopup) return null;

    return (
        <div className="popup" style={{ left: '0', right: 'auto' }}>
            <div className="popup-header">
                <h3>Notifications</h3>
                <button onClick={() => setNotifPopup(false)}>Close</button>
            </div>
            <div className="notification-list">
                {notifications.map(notification => (
                    <div key={notification.id} className="notification-item">
                        <p>{notification.text}</p>
                        <span className="notification-time">{notification.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default NotifPopup;