import React from 'react';

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full h-5 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-green-400 transition-all duration-300 flex items-center justify-center"
        style={{ width: `${progress}%` }}
      >
        <span className="text-white text-xs font-bold">{progress}%</span>
      </div>
    </div>
  );
};

export default ProgressBar;
