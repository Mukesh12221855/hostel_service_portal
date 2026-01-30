import React, { useState } from 'react';
import { useAppStore } from '../store/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { generateAdminInsight } from '../services/geminiService';
import { Sparkles, Loader2, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Complaint, ComplaintStatus } from '../types';

const AdminDashboard: React.FC = () => {
  const { complaints, staffList, assignStaff } = useAppStore();
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  // Stats Logic
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  const statusData = [
    { name: 'Pending', value: stats.pending, color: '#94a3b8' },
    { name: 'In Progress', value: stats.inProgress, color: '#f59e0b' },
    { name: 'Resolved', value: stats.resolved, color: '#10b981' },
  ];

  const categoryData = complaints.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) existing.value++;
    else acc.push({ name: curr.category, value: 1 });
    return acc;
  }, [] as { name: string; value: number }[]).sort((a, b) => b.value - a.value);

  const handleGenerateInsight = async () => {
    setIsLoadingInsight(true);
    const result = await generateAdminInsight(complaints);
    setInsight(result);
    setIsLoadingInsight(false);
  };

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><AlertCircle size={20} /></div>
            <span className="text-slate-500 text-sm font-medium">Total Complaints</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><AlertCircle size={20} /></div>
            <span className="text-slate-500 text-sm font-medium">Pending</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Users size={20} /></div>
            <span className="text-slate-500 text-sm font-medium">In Progress</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.inProgress}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CheckCircle2 size={20} /></div>
            <span className="text-slate-500 text-sm font-medium">Resolved</span>
          </div>
          <p className="text-3xl font-bold text-slate-800">{stats.resolved}</p>
        </div>
      </div>

      {/* AI Insight Section */}
      <div className="bg-indigo-900 rounded-xl p-6 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles size={120} />
        </div>
        <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="text-yellow-400" size={20} />
                    AI Smart Insights
                </h2>
                <button 
                    onClick={handleGenerateInsight}
                    disabled={isLoadingInsight}
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                    {isLoadingInsight ? <Loader2 size={16} className="animate-spin" /> : 'Generate Daily Report'}
                </button>
            </div>
            {insight ? (
                <div className="bg-white/10 p-4 rounded-lg text-indigo-50 leading-relaxed text-sm">
                    {insight}
                </div>
            ) : (
                <p className="text-indigo-300 text-sm">Click the button to analyze complaint trends and generate actionable insights using Gemini AI.</p>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Charts */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-6">Complaints by Category</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Pending Assignments */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <h3 className="font-semibold text-slate-800 mb-4">Pending Assignments</h3>
            <div className="flex-1 overflow-auto pr-2 space-y-3 max-h-[300px]">
                {complaints.filter(c => c.status === 'Pending').length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <CheckCircle2 size={32} className="mb-2 text-green-500" />
                        <p>All cleared! Good job.</p>
                    </div>
                ) : (
                    complaints.filter(c => c.status === 'Pending').map(complaint => (
                        <div key={complaint.id} className="p-4 border border-slate-100 rounded-lg hover:bg-slate-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-600 mb-1">{complaint.category.toUpperCase()}</span>
                                    <h4 className="font-medium text-slate-800">{complaint.title}</h4>
                                    <p className="text-xs text-slate-500">Room: {complaint.studentRoom} • {new Date(complaint.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                                    complaint.priority === 'High' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'
                                }`}>{complaint.priority}</span>
                            </div>
                            
                            <div className="mt-3 pt-3 border-t border-slate-100">
                                <label className="text-xs text-slate-400 mb-1 block">Assign Staff</label>
                                <div className="flex gap-2">
                                    {staffList
                                        .filter(s => s.department === complaint.category || s.department === 'Other' || complaint.category === 'Other')
                                        .slice(0, 3) // Show top 3 matches
                                        .map(staff => (
                                        <button 
                                            key={staff.id}
                                            onClick={() => assignStaff(complaint.id, staff.id, staff.name)}
                                            className="text-xs px-3 py-1.5 bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 rounded-full transition-colors"
                                        >
                                            {staff.name}
                                        </button>
                                    ))}
                                    <button className="text-xs px-3 py-1.5 bg-slate-100 text-slate-500 rounded-full hover:bg-slate-200">
                                        + More
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;