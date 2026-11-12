import React, { useState, useEffect } from 'react';

const ACCEPTED_TYPES = 'image/*,video/*';

const getFileKind = (file) => {
  if (file.type.startsWith('image/')) return 'image';
  return 'video';
};

const FileCard = ({ file, index, onRemove }) => {
  const kind = getFileKind(file);
  const shortName = file.name.length > 22 ? file.name.slice(0, 20) + '…' : file.name;
  const sizeMB = (file.size / 1024 / 1024).toFixed(2);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (kind !== 'image') return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file, kind]);

  return (
    <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-[10px] z-10"
      >
        ✕
      </button>
      {kind === 'image' ? (
        <img src={previewUrl} alt={file.name} className="w-full h-24 object-cover block" />
      ) : (
        <div className="w-full h-24 flex items-center justify-center bg-[#3a5a8c] text-white font-bold text-sm tracking-widest">
          VIDEO
        </div>
      )}
      <div className="px-2 py-1.5 flex flex-col gap-0.5">
        <span className="text-xs font-semibold text-gray-700 truncate" title={file.name}>{shortName}</span>
        <span className="text-[11px] text-gray-400">{sizeMB} MB</span>
      </div>
    </div>
  );
};

const Step1Files = ({ files, onFilesChange, onNext }) => {
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    onFilesChange(prev => [...prev, ...newFiles]);
    e.target.value = '';
  };

  const handleRemove = (index) => {
    onFilesChange(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-1">Upload Files</h2>
      <p className="text-sm text-gray-500 mb-5">Add the images and videos for this project.</p>

      <div className="border-2 border-dashed border-[#4a90e2] rounded-xl p-5 bg-blue-50/40">
        <input
          type="file"
          multiple
          accept={ACCEPTED_TYPES}
          onChange={handleFileChange}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="inline-block px-5 py-2.5 bg-[#4a90e2] text-white rounded-lg cursor-pointer text-sm font-semibold"
        >
          Choose Files
        </label>

        {files.length === 0 && (
          <p className="mt-3 text-sm text-gray-400">No files selected yet.</p>
        )}

        {files.length > 0 && (
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            {files.map((file, index) => (
              <FileCard key={index} file={file} index={index} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={files.length === 0}
        className="w-full mt-6 py-4 bg-[#4a90e2] text-white rounded-lg text-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
};

export default Step1Files;
