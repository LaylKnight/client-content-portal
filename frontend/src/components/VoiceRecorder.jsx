import React, { useState, useRef } from 'react';

const VoiceRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [micError, setMicError] = useState('');
  const mediaRecorderRef = useRef(null);
  const timerRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    setMicError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `voice-note-${Date.now()}.webm`, { type: 'audio/webm' });
        onRecordingComplete(file);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      setMicError('Microphone access denied. Please allow microphone permission and try again.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 bg-red-50 rounded-xl border border-red-100">
      <h3 className="font-semibold text-gray-700 mb-3">Voice Note</h3>
      <div>
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="px-5 py-2 bg-red-500 text-white rounded-md text-sm font-medium"
          >
            Start Recording
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <span className="font-mono text-lg font-bold text-red-500">{formatTime(recordingTime)}</span>
            <button
              type="button"
              onClick={stopRecording}
              className="px-5 py-2 bg-gray-600 text-white rounded-md text-sm font-medium"
            >
              Stop Recording
            </button>
          </div>
        )}
      </div>
      {micError && <p className="mt-2 text-sm text-red-500">{micError}</p>}
    </div>
  );
};

export default VoiceRecorder;
