
import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm';
import AuthPanel from '@/components/AuthPanel';

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 to-yellow-200 flex items-center justify-center p-4 font-poppins">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden">
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <div className="p-8 flex flex-col items-center">
            <AuthForm isLogin={isLoginMode} onToggle={toggleMode} />
          </div>
          <div className="bg-gradient-to-r from-green-400 to-yellow-300 p-8">
            <AuthPanel isLogin={isLoginMode} onToggle={toggleMode} />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex h-[600px] relative">
          {/* Form Container */}
          <div 
            className={`absolute top-0 left-0 w-1/2 h-full flex items-center justify-center p-12 transition-transform duration-700 ease-in-out ${
              isLoginMode ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <AuthForm isLogin={isLoginMode} onToggle={toggleMode} />
          </div>

          {/* Panel Container */}
          <div 
            className={`absolute top-0 w-1/2 h-full bg-gradient-to-r from-green-400 to-yellow-300 transition-transform duration-700 ease-in-out ${
              isLoginMode ? 'left-1/2 translate-x-0' : 'left-0 -translate-x-0'
            }`}
          >
            <AuthPanel isLogin={isLoginMode} onToggle={toggleMode} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
