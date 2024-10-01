import { useState, useEffect } from 'react';
import { useDaily, useDevices } from '@daily-co/react-daily-react-hooks';

export default function DeviceSettings({ isOpen, onClose }) {
  const daily = useDaily();
  const { devices, setAudioDevice, setVideoDevice } = useDevices();

  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');

  useEffect(() => {
    if (devices.audioInput.length > 0) {
      setSelectedAudioDevice(devices.audioInput[0].deviceId);
    }
    if (devices.videoInput.length > 0) {
      setSelectedVideoDevice(devices.videoInput[0].deviceId);
    }
  }, [devices]);

  const handleAudioDeviceChange = (deviceId) => {
    setSelectedAudioDevice(deviceId);
    setAudioDevice(deviceId);
  };

  const handleVideoDeviceChange = (deviceId) => {
    setSelectedVideoDevice(deviceId);
    setVideoDevice(deviceId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Device Settings</h2>
        <div className="mb-4">
          <label className="block mb-2">Microphone</label>
          <select
            value={selectedAudioDevice}
            onChange={(e) => handleAudioDeviceChange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {devices.audioInput.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Camera</label>
          <select
            value={selectedVideoDevice}
            onChange={(e) => handleVideoDeviceChange(e.target.value)}
            className="w-full p-2 border rounded"
          >
            {devices.videoInput.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </div>
        <button onClick={onClose} className="btn btn-primary">
          Close
        </button>
      </div>
    </div>
  );
}