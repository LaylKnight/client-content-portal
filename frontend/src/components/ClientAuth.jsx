import React, { useState } from 'react';
import axios from 'axios';

const ClientAuth = ({ onAuthSuccess }) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = token.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError('');

    try {
      const apiUrl = import.meta.env.VITE_API_URL || '';
      const res = await axios.get(`${apiUrl}/api/auth`, { params: { token: trimmed } });

      localStorage.setItem('clientToken', trimmed);
      localStorage.setItem('clientName', res.data.clientName);
      onAuthSuccess(trimmed, res.data.clientName);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid access code. Please check and try again.');
      } else {
        setError('Could not connect to server. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">Enter Your Access Code</h2>
      <p className="text-gray-500 mb-6 text-sm">You were provided a unique code when your account was set up.</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-5 text-left">
          <label htmlFor="access-code" className="block mb-2 text-sm font-semibold text-gray-700">
            Access Code
          </label>
          <div className="relative">
            <input
              id="access-code"
              type={showToken ? 'text' : 'password'}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your access code"
              autoComplete="off"
              required
              className="w-full px-3 py-3 pr-10 border border-gray-200 rounded-lg text-base focus:outline-none focus:border-[#4a90e2] focus:ring-1 focus:ring-[#4a90e2]"
            />
            <button
              type="button"
              onClick={() => setShowToken(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showToken ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {error && (
          <div className="bg-red-50 text-red-800 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-[#4a90e2] text-white rounded-lg text-lg font-bold disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-[0.98] transition-transform"
        >
          {isLoading ? 'Verifying...' : 'Continue'}
        </button>
      </form>
    </div>
  );
};

export default ClientAuth;
