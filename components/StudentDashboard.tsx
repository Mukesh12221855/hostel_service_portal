import React, { useState } from 'react';
import { useAppStore } from '../store/AppContext';
import { PlusCircle, Clock, CheckCircle2, AlertCircle, Trash2, Wand2, Loader2, Info } from 'lucide-react';
import { enhanceComplaintDescription, categorizeComplaint } from '../services/geminiService';
import { Category, Complaint } from '../types';

const StudentDashboard: React.FC = () => {
  const { user, complaints, addComplaint, deleteComplaint } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('Other');
  const [priority, setPriority] = useState<'Low'|'Medium'|'High'>('Medium');
  
  // AI State
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isCategorizing, setIsCategorizing] = useState(false);

  const myComplaints = complaints.filter(c => c.studentId === user?.id).sort((a, b) => b.createdAt - a.createdAt);

  const handleEnhance = async () => {
    if (!description || description.length < 5) return;
    setIsEnhancing(true);
    const newDesc = await enhanceComplaintDescription(description);
    setDescription(newDesc);
    setIsEnhancing(false);
  };

  const handleAutoCategorize = async () => {
    if (!title && !description) return;
    setIsCategorizing(true);
    const cat = await categorizeComplaint(title, description);
    setCategory(cat as Category);
    setIsCategorizing(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addComplaint({
      title,
      description,
      category,
      priority
    });
    setShowForm(false);
    // Reset form
    setTitle('');
    setDescription('');
    setCategory('Other');
    setPriority('Medium');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Dashboard</h1>
          <p className="text-slate-500">Manage your complaints and service requests</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <PlusCircle size={20} />
          <span>New Complaint</span>
        </button>
      </div>

      {/* New Complaint Modal/Form Area */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-fade-in">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Raise a New Complaint</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., Fan not working"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <select 
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <div className="relative">
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none"
                  placeholder="Describe the issue in detail..."
                  required
                />
                <button
                  type="button"
                  onClick={handleEnhance}
                  disabled={isEnhancing || !description}
                  className="absolute bottom-2 right-2 text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1 rounded-md flex items-center gap-1 transition-colors border border-indigo-200"
                >
                  {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                  AI Polish
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-medium text-slate-700">Category</label>
                 <button
                    type="button"
                    onClick={handleAutoCategorize}
                    disabled={isCategorizing || (!title && !description)}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                 >
                    {isCategorizing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                    Auto-detect
                 </button>
              </div>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Internet">Internet</option>
                <option value="Furniture">Furniture</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
              >
                Submit Complaint
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Complaints List */}
      <div className="grid gap-4">
        {myComplaints.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="mx-auto w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
              <Info className="text-slate-400" />
            </div>
            <h3 className="text-slate-900 font-medium">No complaints history</h3>
            <p className="text-slate-500 text-sm">Raise a complaint to see it tracked here.</p>
          </div>
        ) : (
          myComplaints.map(complaint => (
            <div key={complaint.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    complaint.status === 'Resolved' ? 'bg-green-50 text-green-700 border-green-200' :
                    complaint.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-100 text-slate-700 border-slate-200'
                  }`}>
                    {complaint.status}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock size={12} />
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {complaint.status === 'Pending' && (
                  <button 
                    onClick={() => deleteComplaint(complaint.id)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-slate-800 mb-1">{complaint.title}</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2">{complaint.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">Category: <span className="font-medium text-slate-700">{complaint.category}</span></span>
                  <span className="flex items-center gap-1">Priority: <span className={`font-medium ${
                    complaint.priority === 'High' ? 'text-red-600' : 'text-slate-700'
                  }`}>{complaint.priority}</span></span>
                </div>
                {complaint.assignedStaffName && (
                  <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
                    Assigned to: {complaint.assignedStaffName}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;