import React, { useEffect } from 'react';

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, 30000);
    return () => clearTimeout(timer);
  }, [message]);

  if (!message) return null;

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl text-white text-sm font-medium w-[90%] max-w-sm transition-all ${
      type === 'success' ? 'bg-green-500' : 'bg-red-500'
    }`}>
      <span className="flex-1">{message}</span>
      <button
        onClick={onClose}
        className="text-white/70 hover:text-white text-xl leading-none flex-shrink-0"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;
