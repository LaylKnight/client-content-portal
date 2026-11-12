import React from 'react';

const StepIndicator = ({ current, total }) => {
  return (
    <div className="flex items-center justify-center">
      {Array.from({ length: total }, (_, i) => i + 1).map(step => (
        <React.Fragment key={step}>
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            step < current
              ? 'bg-green-400 text-white'
              : step === current
              ? 'bg-[#4a90e2] text-white'
              : 'bg-gray-200 text-gray-400'
          }`}>
            {step < current ? '✓' : step}
          </div>
          {step < total && (
            <div className={`h-0.5 w-10 transition-colors ${step < current ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
