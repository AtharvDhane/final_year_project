import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';
import { 
  Shield, Users, Database, Clock, Trash2, ShieldAlert, FileText, 
  Ban, CheckCircle, ChevronDown, Activity, RefreshCw, LayoutDashboard,
  Search, Bell, LogOut, ArrowLeft, Settings, UserPlus
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import axios from 'axios';

// Mock chart data for presentation
const activityData = [
  { name: 'Mon', users: 4, docs: 2 },
  { name: 'Tue', users: 7, docs: 5 },
  { name: 'Wed', users: 10, docs: 8 },
  { name: 'Thu', users: 8, docs: 12 },
  { name: 'Fri', users: 15, docs: 20 },
  { name: 'Sat', users: 12, docs: 15 },
  { name: 'Sun', users: 18, docs: 25 },
];

export const AdminDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [usersList, setUsersList] = useState([]);
  const [documentsList, setDocumentsList] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalDocuments: 0, systemHealth: 'Unknown', uptime: 'N/A' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMenuOpen, setActionMenuOpen] = useState(null);

  // New Admin State
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [creatingAdmin, setCreatingAdmin] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, statsData, docsData] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getStats(),
        adminService.getDocuments()
      ]);
      setUsersList(usersData || []);
      setStats(statsData || stats);
      setDocumentsList(docsData || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (userEmail === user.email) {
      alert("You cannot delete your own admin account.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete user ${userEmail}? This action cannot be undone.`)) {
      try {
        await adminService.deleteUser(userId);
        setUsersList(usersList.filter(u => u.id !== userId));
        setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
      } catch (err) {
        alert(err.message || 'Failed to delete user');
      }
    }
    setActionMenuOpen(null);
  };

  const handleToggleSuspend = async (u) => {
    if (u.email === user.email) {
      alert("You cannot suspend your own admin account.");
      return;
    }
    try {
      if (u.suspended) {
        await adminService.activateUser(u.id);
      } else {
        await adminService.suspendUser(u.id);
      }
      setUsersList(usersList.map(userItem => 
        userItem.id === u.id ? { ...userItem, suspended: !u.suspended } : userItem
      ));
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    }
    setActionMenuOpen(null);
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await adminService.changeUserRole(userId, newRole);
      setUsersList(usersList.map(userItem => 
        userItem.id === userId ? { ...userItem, role: newRole } : userItem
      ));
    } catch (err) {
      alert(err.message || 'Failed to change role');
    }
    setActionMenuOpen(null);
  };

  const handleDeleteDocument = async (docId, fileName) => {
    if (window.confirm(`Delete document "${fileName}" from the system completely?`)) {
      try {
        await adminService.deleteDocument(docId);
        setDocumentsList(documentsList.filter(d => d.id !== docId));
        setStats(prev => ({ ...prev, totalDocuments: prev.totalDocuments - 1 }));
      } catch (err) {
        alert(err.message || 'Failed to delete document');
      }
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      setCreatingAdmin(true);
      const res = await axios.post('http://localhost:8080/api/v1/auth/signup', {
        name: newAdminName,
        email: newAdminEmail,
        password: newAdminPassword,
        role: 'ADMIN'
      });
      if(res.data.success) {
        alert('New Admin created successfully!');
        setNewAdminName('');
        setNewAdminEmail('');
        setNewAdminPassword('');
        fetchData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create admin');
    } finally {
      setCreatingAdmin(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ROLE_ADMIN': return 'text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20';
      case 'ROLE_TEACHER': return 'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20';
      case 'ROLE_RESEARCHER': return 'text-cyan-600 bg-cyan-100 dark:text-cyan-400 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20';
      default: return 'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0f111a] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f111a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-white to-slate-50 dark:from-slate-900 dark:via-[#0f111a] dark:to-black flex font-sans text-slate-800 dark:text-slate-200">
      
      {/* 1. Classic Admin Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex-col hidden md:flex shadow-2xl z-20">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <ShieldAlert className="w-6 h-6 mr-3 text-indigo-500" />
          <span className="font-black text-white text-lg tracking-tight uppercase">Admin Panel</span>
        </div>
        
        <div className="p-4 border-b border-slate-800">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">Main Navigation</p>
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('overview')} 
              className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'overview' 
                  ? 'bg-indigo-500/20 text-indigo-400' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('users')} 
              className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'users' 
                  ? 'bg-indigo-500/20 text-indigo-400' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 mr-3" /> User Management
            </button>
            <button 
              onClick={() => setActiveTab('documents')} 
              className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'documents' 
                  ? 'bg-indigo-500/20 text-indigo-400' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4 mr-3" /> Content Moderation
            </button>
          </nav>
        </div>

        <div className="p-4 border-b border-slate-800">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">Configuration</p>
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('settings')} 
              className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'settings' 
                  ? 'bg-indigo-500/20 text-indigo-400' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4 mr-3" /> System Settings
            </button>
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-800">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-2">System Options</p>
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <ArrowLeft className="w-4 h-4 mr-3" /> Exit to Website
          </button>
          <button onClick={handleLogout} className="w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all mt-1">
            <LogOut className="w-4 h-4 mr-3" /> Sign Out
          </button>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-black text-slate-800 dark:text-white hidden sm:block">
              {activeTab === 'overview' && 'System Overview'}
              {activeTab === 'users' && 'Manage Users'}
              {activeTab === 'documents' && 'Global Documents'}
              {activeTab === 'settings' && 'System Settings'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button onClick={fetchData} className="p-2 text-slate-400 hover:text-indigo-500 transition-colors" title="Refresh Data">
              <RefreshCw className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-800 dark:text-white">{user?.name || 'Administrator'}</div>
                <div className="text-[10px] font-black text-indigo-500 uppercase">Super Admin</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white dark:border-slate-800 shadow-md flex items-center justify-center text-white font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Main View */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {error && (
              <div className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 p-4 rounded-2xl text-rose-600 dark:text-rose-400 font-bold flex items-center space-x-2 shadow-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>{error}</span>
              </div>
            )}

            {/* View: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  {/* Card 1 */}
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <Users className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">+12%</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalUsers}</h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Users</p>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <FileText className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full">+24%</span>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stats.totalDocuments}</h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Total Documents</p>
                    </div>
                  </div>

                  {/* Card 3 */}
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                        <Database className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-cyan-600 dark:text-cyan-400 flex items-center space-x-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></div>
                        <span>{stats.systemHealth}</span>
                      </h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Database Health</p>
                    </div>
                  </div>

                  {/* Card 4 */}
                  <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                        <Activity className="w-6 h-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black text-slate-800 dark:text-white">{stats.uptime}</h3>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Server Uptime</p>
                    </div>
                  </div>

                </div>

                {/* Chart Area */}
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
                  <h4 className="text-base font-black tracking-tight text-slate-800 dark:text-white mb-6">Traffic & Activity Analytics</h4>
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorDocs" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                        <YAxis stroke="#94a3b8" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
                          itemStyle={{ fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="users" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" name="New Users" />
                        <Area type="monotone" dataKey="docs" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorDocs)" name="Uploaded Files" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* View: User Management */}
            {activeTab === 'users' && (
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden animate-in fade-in duration-300">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <h2 className="text-base font-black tracking-tight text-slate-800 dark:text-white">Registered Accounts</h2>
                  <span className="bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold">{usersList.length} Total</span>
                </div>
                
                <div className="overflow-x-auto min-h-[400px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950/50 text-[10px] uppercase tracking-widest font-black text-slate-500 border-b border-slate-200 dark:border-slate-800">
                        <th className="px-6 py-4">User Details</th>
                        <th className="px-6 py-4">Assigned Role</th>
                        <th className="px-6 py-4">Account Status</th>
                        <th className="px-6 py-4 text-right">Admin Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {usersList.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                          <td className="px-6 py-4">
                            <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{u.name}</div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getRoleColor(u.role)}`}>
                              {u.role ? u.role.replace('ROLE_', '') : 'USER'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {u.suspended ? (
                              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg text-[10px] font-black border border-rose-200 dark:border-rose-500/20">
                                <Ban className="w-3.5 h-3.5" />
                                <span>SUSPENDED</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black border border-emerald-200 dark:border-emerald-500/20">
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>ACTIVE</span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right relative">
                            <div className="relative inline-block text-left">
                              <button
                                onClick={() => setActionMenuOpen(actionMenuOpen === u.id ? null : u.id)}
                                className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-slate-700 dark:text-slate-300 bg-white dark:bg-transparent shadow-sm"
                              >
                                <span className="text-xs font-bold mr-2">Options</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${actionMenuOpen === u.id ? 'rotate-180' : ''}`} />
                              </button>
                              
                              {actionMenuOpen === u.id && (
                                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                                  <div className="p-2">
                                    <div className="px-3 py-2 text-[10px] font-black uppercase text-slate-400">Change Role</div>
                                    {['ROLE_USER', 'ROLE_STUDENT', 'ROLE_TEACHER', 'ROLE_RESEARCHER'].map(r => (
                                      u.role !== r && (
                                        <button
                                          key={r}
                                          onClick={() => handleChangeRole(u.id, r)}
                                          className="w-full text-left px-3 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition"
                                        >
                                          Set {r.replace('ROLE_', '')}
                                        </button>
                                      )
                                    ))}
                                    
                                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-2"></div>
                                    
                                    <button
                                      onClick={() => handleToggleSuspend(u)}
                                      disabled={u.email === user.email}
                                      className={`w-full flex items-center space-x-2 px-3 py-2.5 text-xs font-bold rounded-xl transition disabled:opacity-50 ${u.suspended ? 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-500/20' : 'text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-500/20'}`}
                                    >
                                      {u.suspended ? <CheckCircle className="w-4 h-4" /> : <Ban className="w-4 h-4" />}
                                      <span>{u.suspended ? 'Restore Access' : 'Suspend Account'}</span>
                                    </button>
                                    
                                    <button
                                      onClick={() => handleDeleteUser(u.id, u.email)}
                                      disabled={u.email === user.email}
                                      className="w-full flex items-center space-x-2 px-3 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/20 rounded-xl transition mt-1 disabled:opacity-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      <span>Delete Data</span>
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* View: Content Moderation */}
            {activeTab === 'documents' && (
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden animate-in fade-in duration-300">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="text-base font-black tracking-tight text-slate-800 dark:text-white">Central File Repository</h2>
                  <p className="text-xs text-slate-500 mt-1">Audit and remove files hosted across all user workspaces.</p>
                </div>
                
                <div className="overflow-x-auto min-h-[400px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950/50 text-[10px] uppercase tracking-widest font-black text-slate-500 border-b border-slate-200 dark:border-slate-800">
                        <th className="px-6 py-4">Filename</th>
                        <th className="px-6 py-4">Format</th>
                        <th className="px-6 py-4">File Size</th>
                        <th className="px-6 py-4">Indexing</th>
                        <th className="px-6 py-4 text-right">Delete</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {documentsList.map((doc) => (
                        <tr key={doc.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                          <td className="px-6 py-4">
                            <div className="font-bold text-sm text-slate-900 dark:text-slate-100">{doc.fileName}</div>
                            <div className="text-[10px] font-mono text-slate-400 mt-1">ID: {doc.id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-black uppercase rounded-md border border-slate-200 dark:border-slate-700">
                              {doc.fileType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-500">
                            {(doc.fileSize / (1024 * 1024)).toFixed(2)} MB
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                              {doc.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleDeleteDocument(doc.id, doc.fileName)}
                              className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                              title="Force Delete File"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {documentsList.length === 0 && (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-slate-500 font-bold">No documents hosted currently.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* View: Settings / Create Admin */}
            {activeTab === 'settings' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
                  <div className="flex items-center space-x-3 mb-6">
                    <UserPlus className="w-6 h-6 text-indigo-500" />
                    <div>
                      <h3 className="text-lg font-black text-slate-800 dark:text-white">Create New Administrator</h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Grant full system access to a new user account.</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleCreateAdmin} className="max-w-md space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-800 dark:text-white transition"
                        placeholder="e.g. John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-800 dark:text-white transition"
                        placeholder="admin@axiom.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">Password</label>
                      <input 
                        type="password" 
                        required
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold text-slate-800 dark:text-white transition"
                        placeholder="Secure password"
                      />
                    </div>
                    <button 
                      type="submit"
                      disabled={creatingAdmin}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-black shadow-lg shadow-indigo-500/25 transition disabled:opacity-50"
                    >
                      {creatingAdmin ? 'Creating...' : 'Create Admin Account'}
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
