"use client";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { CiBellOn } from "react-icons/ci";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('https://luminous-bsd7.onrender.com/');
      setNotifications(response.data.notification);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsViewed = async (notificationId) => {
    try {
      await axios.post('https://luminous-bsd7.onrender.com/update', null, {
        params: { notification_id: notificationId }
      });
      setNotifications(notifications.map(notif => 
        notif.id === notificationId ? { ...notif, viewed: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as viewed:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unviewedNotifications = notifications.filter(notif => !notif.viewed);

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="relative">
        <CiBellOn className="text-lg" />
        {unviewedNotifications.length > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 bg-red-600 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          <div className="px-4 py-2 font-semibold text-gray-700">Notifications</div>
          <ul className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <li 
                key={notification.id} 
                className={`px-4 py-2 hover:bg-gray-100 ${notification.viewed ? 'bg-white' : 'bg-blue-50'}`}
                onClick={() => !notification.viewed && markAsViewed(notification.id)}
              >
                <p className="text-sm text-gray-600">{notification.message}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
