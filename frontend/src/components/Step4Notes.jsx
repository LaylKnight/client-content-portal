import React from 'react';
import ProgressBar from './ProgressBar';

const Step4Notes = ({ notes, onNotesChange, onBack, onSubmit, isUploading, uploadProgress }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Additional Notes</h2>
      <p className="text-sm text-gray-500 mb-5">Add any extra details about this project.</p>

      <textarea
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        placeholder="Any extra details..."
        rows="6"
        className="w-full px-3 py-3 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2] resize-none"
      />

      {isUploading && (
        <div className="mt-4">
          <ProgressBar progress={uploadProgress} />
        </div>
      )}

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={isUploading}
          className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-lg text-lg font-bold hover:bg-gray-200 disabled:opacity-50 transition-colors"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={isUploading}
          className="flex-1 py-4 bg-[#4a90e2] text-white rounded-lg text-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>
    </div>
  );
};

export default Step4Notes;
