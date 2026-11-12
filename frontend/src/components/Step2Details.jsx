import React from 'react';

const UPLOAD_TYPES = [
  'Project Pictures and Videos',
  'Customer Video Testimonials',
];

const Step2Details = ({
  uploadTypes, projectTitle, projectLocation,
  onUploadTypesChange, onProjectTitleChange, onProjectLocationChange,
  onBack, onNext,
}) => {
  const toggleType = (type) => {
    onUploadTypesChange(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const canProceed = uploadTypes.length > 0 && projectTitle.trim() && projectLocation.trim();

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Project Details</h2>
      <p className="text-sm text-gray-500 mb-5">Tell us about this submission.</p>

      <div className="space-y-5">
        <div>
          <label className="block mb-3 text-sm font-semibold text-gray-700">Type of Upload</label>
          <div className="space-y-2">
            {UPLOAD_TYPES.map(type => (
              <label
                key={type}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={uploadTypes.includes(type)}
                  onChange={() => toggleType(type)}
                  className="w-4 h-4 accent-[#4a90e2]"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">Project Title</label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => onProjectTitleChange(e.target.value)}
            placeholder="Enter project title"
            className="w-full px-3 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2]"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-gray-700">Project Location</label>
          <input
            type="text"
            value={projectLocation}
            onChange={(e) => onProjectLocationChange(e.target.value)}
            placeholder="Enter project location"
            className="w-full px-3 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2]"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-lg text-lg font-bold hover:bg-gray-200 transition-colors"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canProceed}
          className="flex-1 py-4 bg-[#4a90e2] text-white rounded-lg text-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step2Details;
