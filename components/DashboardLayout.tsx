import React from 'react';
import { useAppStore } from '../store/AppContext';
import { LogOut, User as UserIcon, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardLayout = ({ children }: { children?: React.ReactNode }) => {
  const { user, logout } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <span className="text-xl font-bold text-slate-800 hidden sm:block">Smart Hostel</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-100 rounded-full">
                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <UserIcon size={18} />
                </div>
                <div className="hidden md:block text-sm pr-2">
                    <p className="font-semibold text-slate-700 leading-none">{user?.name}</p>
                    <p className="text-slate-500 text-xs capitalize">{user?.role}</p>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;