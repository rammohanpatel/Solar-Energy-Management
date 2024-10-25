"use client"; 
import Navbar from '@/components/Navbar';
import React, { useState } from 'react';

const devices = [
  { id: 1, name: 'Washing Machine' },
  { id: 2, name: 'Smart Light' },
  { id: 3, name: 'Smart Thermostat' },
  { id: 4, name: 'Smart Coffee Maker' },
  { id: 5, name: 'Smart Speaker' },
];

export default function SmartDashboard() {
  const [deviceStates, setDeviceStates] = useState(
    devices.reduce((acc, device) => {
      acc[device.id] = false; 
      return acc;
    }, {})
  );

  const toggleDevice = (id) => {
    setDeviceStates((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
    <Navbar />   
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Smart Devices</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <div key={device.id} className="p-6 bg-white shadow-md rounded-lg flex justify-between items-center">
            <span className="text-lg font-medium mr-2">{device.name}</span>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="hidden"
                checked={deviceStates[device.id]}
                onChange={() => toggleDevice(device.id)}
              />
              <div className="relative">
                <div className={`block w-14 h-8 rounded-full ${deviceStates[device.id] ? ' bg-blue-500' : 'bg-gray-300'}`}></div>
                <div
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${deviceStates[device.id] ? 'translate-x-full' : ''}`}
                ></div>
              </div>
            </label>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
