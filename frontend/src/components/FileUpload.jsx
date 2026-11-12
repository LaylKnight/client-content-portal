import React from 'react';

const ACCEPTED_TYPES = 'image/*,video/*,audio/*,application/pdf';

const getFileKind = (file) => {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type === 'application/pdf') return 'pdf';
  return 'file';
};

const ICON_BOX_CONFIG = {
  video: { label: 'VIDEO', bg: 'bg-[#3a5a8c]' },
  audio: { label: 'AUDIO', bg: 'bg-[#7c4daa]' },
  pdf:   { label: 'PDF',   bg: 'bg-[#c0392b]' },
  file:  { label: 'FILE',  bg: 'bg-gray-500' },
};

const FileCard = ({ file, index, onRemove }) => {
  const kind = getFileKind(file);
  const shortName = file.name.length > 22 ? file.name.slice(0, 20) + '…' : file.name;
  const sizeMB = (file.size / 1024 / 1024).toFixed(2);

  return (
    <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-[10px] z-10 leading-none"
      >
        ✕
      </button>
      {kind === 'image' ? (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="w-full h-24 object-cover block"
        />
      ) : (
        <div className={`w-full h-24 flex items-center justify-center text-white font-bold text-sm tracking-widest ${ICON_BOX_CONFIG[kind].bg}`}>
          {ICON_BOX_CONFIG[kind].label}
        </div>
      )}
      <div className="px-2 py-1.5 flex flex-col gap-0.5">
        <span className="text-xs font-semibold text-gray-700 truncate" title={file.name}>{shortName}</span>
        <span className="text-[11px] text-gray-400">{sizeMB} MB</span>
      </div>
    </div>
  );
};

const FileUpload = ({ selectedFiles, onFileSelect, onFileRemove }) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    onFileSelect(files);
  };

  return (
    <div className="border-2 border-dashed border-[#4a90e2] rounded-xl p-4 bg-blue-50/40">
      <h3 className="font-semibold text-gray-700 mb-3">Files & Media</h3>
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
        className="inline-block px-5 py-2 bg-[#4a90e2] text-white rounded-md cursor-pointer text-sm font-medium"
      >
        Choose Files
      </label>
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5 mt-3">
          {selectedFiles.map((file, index) => (
            <FileCard key={index} file={file} index={index} onRemove={onFileRemove} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
