import React, { useState } from 'react';
import { useAppStore } from '../store/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, KeyRound, User, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAppStore();
  const navigate = useNavigate();
  
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (login(id, password)) {
      navigate('/dashboard');
    } else {
      setError('Invalid Credentials. Please check your ID and Password.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="bg-blue-600 p-8 text-center">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm mb-4">
            <Building2 className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Smart Hostel Portal</h1>
          <p className="text-blue-100 text-sm">Secure Login Access</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2 border border-red-200">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">User ID</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  placeholder="e.g. STU001, ADMIN001"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              New Student?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium hover:underline">
                Create Account
              </Link>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
             <p className="text-xs text-slate-400 text-center mb-2">Demo Credentials (Password: "password")</p>
             <div className="flex justify-center gap-2 text-[10px] text-slate-500">
                <span className="bg-slate-100 px-2 py-1 rounded">Admin: ADMIN001</span>
                <span className="bg-slate-100 px-2 py-1 rounded">Staff: STAFF001</span>
                <span className="bg-slate-100 px-2 py-1 rounded">Student: STU001</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;