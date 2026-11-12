import React, { useState, useRef, useEffect } from 'react';

const Step3Voice = ({ voiceNote, onVoiceNoteChange, onBack, onNext }) => {
  const [status, setStatus] = useState('idle'); // idle | recording | paused | done
  const [recordingTime, setRecordingTime] = useState(0);
  const [micError, setMicError] = useState('');

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const animationRef = useRef(null);
  const canvasRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(animationRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, []);

  useEffect(() => {
    if (status === 'recording') {
      drawWaveform();
    } else {
      cancelAnimationFrame(animationRef.current);
    }
  }, [status]);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = '#fff1f2';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ef4444';
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
    };

    draw();
  };

  const startRecording = async () => {
    setMicError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `voice-note-${Date.now()}.webm`, { type: 'audio/webm' });
        onVoiceNoteChange(file);
        stream.getTracks().forEach(t => t.stop());
      };

      mediaRecorderRef.current.start();
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
      setStatus('recording');
    } catch (err) {
      console.error('Microphone error:', err);
      setMicError('Microphone access denied. Please allow microphone permission and try again.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorderRef.current && status === 'recording') {
      mediaRecorderRef.current.pause();
      clearInterval(timerRef.current);
      setStatus('paused');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && status === 'paused') {
      mediaRecorderRef.current.resume();
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
      setStatus('recording');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
      setStatus('done');
    }
  };

  const redoRecording = () => {
    clearInterval(timerRef.current);
    cancelAnimationFrame(animationRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    chunksRef.current = [];
    onVoiceNoteChange(null);
    setRecordingTime(0);
    setStatus('idle');
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Voice Note</h2>
      <p className="text-sm text-gray-500 mb-5">
        Record a 1-2 minute voice note describing the type of project this was.
      </p>

      <div className="p-5 bg-red-50 rounded-xl border border-red-100">
        {/* Waveform canvas — always mounted, visibility controlled */}
        <canvas
          ref={canvasRef}
          width={500}
          height={64}
          className={`w-full h-16 rounded-lg mb-4 ${status === 'recording' || status === 'paused' ? 'block' : 'hidden'}`}
        />

        {/* Timer */}
        {(status === 'recording' || status === 'paused') && (
          <p className="font-mono text-2xl font-bold text-red-500 text-center mb-4">
            {formatTime(recordingTime)}
            {status === 'paused' && <span className="text-sm font-normal text-gray-400 ml-2">paused</span>}
          </p>
        )}

        {/* Done state */}
        {status === 'done' && (
          <div className="text-center mb-4">
            <p className="text-green-600 font-semibold">Voice note recorded</p>
            <p className="text-sm text-gray-400 mt-1">{formatTime(recordingTime)} recorded</p>
          </div>
        )}

        {/* Idle hint */}
        {status === 'idle' && (
          <p className="text-sm text-gray-400 text-center mb-4">Press the button below to start recording.</p>
        )}

        {/* Controls */}
        <div className="flex gap-2 justify-center flex-wrap">
          {status === 'idle' && (
            <button type="button" onClick={startRecording}
              className="px-6 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold">
              Start Recording
            </button>
          )}
          {status === 'recording' && (
            <>
              <button type="button" onClick={pauseRecording}
                className="px-5 py-2.5 bg-yellow-500 text-white rounded-lg text-sm font-semibold">
                Pause
              </button>
              <button type="button" onClick={stopRecording}
                className="px-5 py-2.5 bg-gray-600 text-white rounded-lg text-sm font-semibold">
                Stop
              </button>
              <button type="button" onClick={redoRecording}
                className="px-5 py-2.5 bg-red-100 text-red-600 rounded-lg text-sm font-semibold">
                Redo
              </button>
            </>
          )}
          {status === 'paused' && (
            <>
              <button type="button" onClick={resumeRecording}
                className="px-5 py-2.5 bg-red-500 text-white rounded-lg text-sm font-semibold">
                Resume
              </button>
              <button type="button" onClick={stopRecording}
                className="px-5 py-2.5 bg-gray-600 text-white rounded-lg text-sm font-semibold">
                Stop
              </button>
              <button type="button" onClick={redoRecording}
                className="px-5 py-2.5 bg-red-100 text-red-600 rounded-lg text-sm font-semibold">
                Redo
              </button>
            </>
          )}
          {status === 'done' && (
            <button type="button" onClick={redoRecording}
              className="px-5 py-2.5 bg-red-100 text-red-600 rounded-lg text-sm font-semibold">
              Record Again
            </button>
          )}
        </div>

        {micError && <p className="mt-3 text-sm text-red-500 text-center">{micError}</p>}
      </div>

      <div className="flex gap-3 mt-6">
        <button type="button" onClick={onBack}
          className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-lg text-lg font-bold hover:bg-gray-200 transition-colors">
          Prev
        </button>
        <button type="button" onClick={onNext}
          className="flex-1 py-4 bg-[#4a90e2] text-white rounded-lg text-lg font-bold transition-colors">
          {voiceNote ? 'Next' : 'Skip'}
        </button>
      </div>
    </div>
  );
};

export default Step3Voice;
