"use client";
import { useState } from 'react';

import { CiBellOn } from "react-icons/ci";
const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = [
    {
      id: 1,
      text: 'Edit your information in a swipe Sint occaecat cupidatat non proident.',
      date: '12 May, 2025',
    },
    {
      id: 2,
      text: 'It is a long established fact that a reader will be distracted by the readable.',
      date: '24 Feb, 2025',
    },
    {
      id: 3,
      text: 'There are many variations of passages of Lorem Ipsum available.',
      date: '04 Jan, 2025',
    },
  ];

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button onClick={() => setIsOpen(!isOpen)} className="relative">
        <CiBellOn className="text-lg" />
        {/* Notification Indicator (optional) */}
        <span className="absolute top-0 right-0 block h-2 w-2 bg-red-600 rounded-full"></span>
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg overflow-hidden z-50">
          <div className="px-4 py-2 font-semibold text-gray-700">Notifications</div>
          <ul className="divide-y divide-gray-100">
            {notifications.map((notification) => (
              <li key={notification.id} className="px-4 py-2 hover:bg-gray-100">
                <p className="text-sm text-gray-600">{notification.text}</p>
                <span className="text-xs text-gray-400">{notification.date}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
