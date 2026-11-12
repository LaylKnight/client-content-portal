import React, { useState } from 'react';
import axios from 'axios';
import StepIndicator from './StepIndicator';
import Step1Files from './Step1Files';
import Step2Details from './Step2Details';
import Step3Voice from './Step3Voice';
import Step4Notes from './Step4Notes';
import Toast from './Toast';

const TOTAL_STEPS = 4;

const UploadForm = ({ token, clientName, onLogout }) => {
  const [step, setStep] = useState(1);
  const isDemo = token?.trim().toLowerCase() === 'demo-1234';

  const [files, setFiles] = useState([]);
  const [uploadTypes, setUploadTypes] = useState([]);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [voiceNote, setVoiceNote] = useState(null);
  const [notes, setNotes] = useState('');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });

  const next = () => setStep(s => Math.min(s + 1, TOTAL_STEPS));
  const prev = () => setStep(s => Math.max(s - 1, 1));

  const resetWizard = () => {
    setStep(1);
    setFiles([]);
    setUploadTypes([]);
    setProjectTitle('');
    setProjectLocation('');
    setVoiceNote(null);
    setNotes('');
  };

  const simulateClientSideDemoUpload = async () => {
    for (let p = 20; p <= 100; p += 20) {
      await new Promise(resolve => setTimeout(resolve, 220));
      setUploadProgress(p);
    }
    setMessage({
      type: 'success',
      text: 'Demo upload complete! (Simulated — no files written to Google Drive)',
    });
    resetWizard();
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    setUploadProgress(0);
    setMessage({ type: '', text: '' });

    const data = new FormData();
    data.append('token', token);
    data.append('projectTitle', projectTitle);
    data.append('projectLocation', projectLocation);
    data.append('uploadTypes', JSON.stringify(uploadTypes));
    data.append('notes', notes);
    files.forEach(file => data.append('files', file));
    if (voiceNote) data.append('files', voiceNote);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await axios.post(`${apiUrl}/api/upload`, data, {
        onUploadProgress: (e) => {
          if (e.total) {
            setUploadProgress(Math.round((e.loaded * 100) / e.total));
          }
        }
      });

      const successText = res.data?.isDemo
        ? res.data.message
        : 'Upload successful! Your files are in Google Drive.';
      setMessage({ type: 'success', text: successText });
      resetWizard();
    } catch (err) {
      // If running in static frontend-only Demo Mode without a backend server,
      // simulate the upload progress bar so portfolio visitors get the full experience.
      if (isDemo && err.response?.status !== 400 && err.response?.status !== 401) {
        await simulateClientSideDemoUpload();
        return;
      }

      console.error('Upload error:', err);
      if (err.response?.status === 401) {
        setMessage({ type: 'error', text: 'Session expired. Please sign out and re-enter your access code.' });
      } else if (err.response?.status === 400 && err.response?.data?.error) {
        setMessage({ type: 'error', text: err.response.data.error });
      } else {
        setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs text-gray-400 font-medium">Signed in as</p>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-700">{clientName}</p>
            {isDemo && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-[#4a90e2] rounded-full">
                Demo Mode
              </span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors"
        >
          Sign out
        </button>
      </div>

      <StepIndicator current={step} total={TOTAL_STEPS} />

      <div className="mt-6">
        {step === 1 && (
          <Step1Files
            files={files}
            onFilesChange={setFiles}
            onNext={next}
          />
        )}
        {step === 2 && (
          <Step2Details
            uploadTypes={uploadTypes}
            projectTitle={projectTitle}
            projectLocation={projectLocation}
            onUploadTypesChange={setUploadTypes}
            onProjectTitleChange={setProjectTitle}
            onProjectLocationChange={setProjectLocation}
            onBack={prev}
            onNext={next}
          />
        )}
        {step === 3 && (
          <Step3Voice
            voiceNote={voiceNote}
            onVoiceNoteChange={setVoiceNote}
            onBack={prev}
            onNext={next}
          />
        )}
        {step === 4 && (
          <Step4Notes
            notes={notes}
            onNotesChange={setNotes}
            onBack={prev}
            onSubmit={handleSubmit}
            isUploading={isUploading}
            uploadProgress={uploadProgress}
          />
        )}
      </div>

      <Toast
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ type: '', text: '' })}
      />
    </div>
  );
};

export default UploadForm;
