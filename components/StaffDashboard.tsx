import React from 'react';
import { useAppStore } from '../store/AppContext';
import { Clock, CheckCircle2, MapPin, AlertTriangle } from 'lucide-react';
import { ComplaintStatus } from '../types';

const StaffDashboard: React.FC = () => {
  const { user, complaints, updateComplaintStatus } = useAppStore();

  // Filter tasks assigned to this staff member
  const myTasks = complaints.filter(c => c.assignedTo === user?.id);
  const pendingTasks = myTasks.filter(c => c.status !== 'Resolved' && c.status !== 'Rejected');
  const completedTasks = myTasks.filter(c => c.status === 'Resolved');

  const handleStatusChange = (id: string, newStatus: ComplaintStatus) => {
    updateComplaintStatus(id, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Staff Workspace</h1>
            <p className="text-slate-500">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-4">
            <div className="text-center">
                <span className="block text-2xl font-bold text-blue-600">{pendingTasks.length}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wide">Pending</span>
            </div>
            <div className="w-px bg-slate-200"></div>
            <div className="text-center">
                <span className="block text-2xl font-bold text-green-600">{completedTasks.length}</span>
                <span className="text-xs text-slate-500 uppercase tracking-wide">Completed</span>
            </div>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
        <Clock className="text-amber-500" size={20} />
        Active Tasks
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {pendingTasks.length === 0 ? (
           <div className="col-span-2 py-12 text-center text-slate-400 bg-white rounded-xl border border-dashed border-slate-300">
               No pending tasks. Enjoy your break!
           </div> 
        ) : (
            pendingTasks.map(task => (
            <div key={task.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group hover:border-blue-300 transition-all">
                <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                            task.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                            {task.priority} Priority
                        </span>
                        <span className="text-xs text-slate-400">{new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                    
                    <h3 className="font-semibold text-lg text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">{task.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                        <MapPin size={14} />
                        <span>Room: {task.studentRoom}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span>{task.studentName}</span>
                    </div>
                    
                    <p className="text-slate-600 text-sm bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                        {task.description}
                    </p>

                    <div className="flex gap-2 pt-2">
                        {task.status === 'Pending' || task.status === 'In Progress' ? (
                            <button 
                                onClick={() => handleStatusChange(task.id, 'Resolved')}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={16} />
                                Mark Resolved
                            </button>
                        ) : null}
                    </div>
                </div>
            </div>
            ))
        )}
      </div>

      {completedTasks.length > 0 && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-green-500" size={20} />
                Recently Completed
            </h2>
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
                {completedTasks.slice(0, 5).map(task => (
                    <div key={task.id} className="p-4 flex justify-between items-center opacity-75 hover:opacity-100 transition-opacity">
                        <div>
                            <h4 className="font-medium text-slate-800 line-through decoration-slate-400">{task.title}</h4>
                            <p className="text-xs text-slate-500">Room {task.studentRoom} • {new Date(task.updatedAt).toLocaleDateString()}</p>
                        </div>
                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded border border-green-100">Done</span>
                    </div>
                ))}
            </div>
          </div>
      )}
    </div>
  );
};

export default StaffDashboard;