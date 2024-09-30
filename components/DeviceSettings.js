import { useState, useEffect, useRef } from 'react';

export default function DeviceSettings({ 
  isOpen, 
  onClose, 
  devices, 
  selectedDevices, 
  onDeviceChange, 
  stream,
  testAudioUrl
}) {
  const [localStream, setLocalStream] = useState(null);
  const [inputVolume, setInputVolume] = useState(100);
  const [outputVolume, setOutputVolume] = useState(100);
  const localVideoRef = useRef(null);
  const audioContext = useRef(null);
  const gainNode = useRef(null);
  const testAudioRef = useRef(null);

  useEffect(() => {
    if (isOpen && stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const newStream = new MediaStream([videoTrack]);
        setLocalStream(newStream);
      }
    }
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, stream]);

  useEffect(() => {
    if (localStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (stream && !audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      gainNode.current = audioContext.current.createGain();
      const source = audioContext.current.createMediaStreamSource(stream);
      source.connect(gainNode.current);
      gainNode.current.connect(audioContext.current.destination);
    }
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
        gainNode.current = null;
      }
    };
  }, [stream]);

  const handleInputVolumeChange = (e) => {
    const volume = parseInt(e.target.value);
    setInputVolume(volume);
    if (gainNode.current) {
      gainNode.current.gain.setValueAtTime(volume / 100, audioContext.current.currentTime);
    }
  };

  const handleOutputVolumeChange = (e) => {
    const volume = parseInt(e.target.value);
    setOutputVolume(volume);
    if (testAudioRef.current) {
      testAudioRef.current.volume = volume / 100;
    }
  };

  const playTestSound = () => {
    if (testAudioRef.current) {
      testAudioRef.current.play();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4">Device Settings</h2>
        <div className="mb-4">
          <label className="block mb-2">Camera</label>
          <select
            value={selectedDevices.videoinput}
            onChange={(e) => onDeviceChange('videoinput', e.target.value)}
            className="w-full p-2 border rounded"
          >
            {devices.videoinput.map(device => (
              <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Microphone</label>
          <select
            value={selectedDevices.audioinput}
            onChange={(e) => onDeviceChange('audioinput', e.target.value)}
            className="w-full p-2 border rounded"
          >
            {devices.audioinput.map(device => (
              <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Speaker</label>
          <select
            value={selectedDevices.audiooutput}
            onChange={(e) => onDeviceChange('audiooutput', e.target.value)}
            className="w-full p-2 border rounded"
          >
            {devices.audiooutput.map(device => (
              <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Input Volume</label>
          <input
            type="range"
            min="0"
            max="200"
            value={inputVolume}
            onChange={handleInputVolumeChange}
            className="w-full"
          />
          <span>{inputVolume}%</span>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Output Volume</label>
          <input
            type="range"
            min="0"
            max="100"
            value={outputVolume}
            onChange={handleOutputVolumeChange}
            className="w-full"
          />
          <span>{outputVolume}%</span>
          <button onClick={playTestSound} className="ml-2 btn btn-sm btn-primary">Test</button>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Camera Preview</label>
          <video ref={localVideoRef} autoPlay muted playsInline className="w-full h-auto" />
        </div>
        <button onClick={onClose} className="btn btn-primary">Close</button>
        <audio ref={testAudioRef} src={testAudioUrl} />
      </div>
    </div>
  );
}