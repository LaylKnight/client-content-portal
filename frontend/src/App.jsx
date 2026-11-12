import React, { useState, useEffect } from 'react';
import UploadForm from './components/UploadForm';
import ClientAuth from './components/ClientAuth';

function App() {
  const [authState, setAuthState] = useState({ token: null, clientName: null });

  useEffect(() => {
    const savedToken = localStorage.getItem('clientToken');
    const savedName = localStorage.getItem('clientName');
    if (savedToken && savedName) {
      setAuthState({ token: savedToken, clientName: savedName });
    }
  }, []);

  const handleAuthSuccess = (token, clientName) => {
    setAuthState({ token, clientName });
  };

  const handleLogout = () => {
    localStorage.removeItem('clientToken');
    localStorage.removeItem('clientName');
    setAuthState({ token: null, clientName: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex justify-center items-start sm:items-center p-5">
      <div className="w-full max-w-xl">
        <header className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold mb-2">Client Content Portal</h1>
          <p className="text-sm opacity-80">Securely upload your project files and voice notes</p>
        </header>
        <main className="bg-white/95 p-8 rounded-2xl shadow-2xl">
          {authState.token ? (
            <UploadForm
              token={authState.token}
              clientName={authState.clientName}
              onLogout={handleLogout}
            />
          ) : (
            <ClientAuth onAuthSuccess={handleAuthSuccess} />
          )}
        </main>
        <footer className="text-center mt-8 text-white text-sm opacity-70">
          <p>&copy; {new Date().getFullYear()} Content Submission System</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
