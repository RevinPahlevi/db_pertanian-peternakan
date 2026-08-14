import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Map, Tractor, FileDown, Sprout, ArrowUpRight } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#a07d70', '#8b5cf6'];

const QuickActionButton = ({ to, icon: Icon, title, desc, gradientFrom, gradientTo }) => (
  <Link to={to} className="group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-5 overflow-hidden">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      style={{ background: `linear-gradient(135deg, ${gradientFrom}08, ${gradientTo}10)` }} />
    <div className="relative w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
      style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="relative flex-1 min-w-0">
      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">{title}</h3>
      <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
    </div>
    <ArrowUpRight className="relative w-4 h-4 text-gray-300 group-hover:text-green-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
  </Link>
);

const StatCard = ({ title, value, subtitle, icon: Icon, accentColor, bgColor }) => (
  <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
    <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-8 translate-x-8 opacity-60"
      style={{ background: bgColor }} />
    <div className="relative">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: bgColor }}>
        <Icon className="w-5 h-5" style={{ color: accentColor }} />
      </div>
      <div className="text-2xl font-bold text-gray-900 tracking-tight">{value}</div>
      <div className="text-sm font-medium text-gray-600 mt-0.5">{title}</div>
      <div className="text-xs text-gray-400 mt-1">{subtitle}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPetani: 0,
    totalLahan: 0,
    totalTernak: 0,
    komoditasPertanian: [],
    lahanKomoditas: [],
    jenisTernak: []
  });
  
  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-6 rounded-full bg-green-600" />
            <h1 className="text-xl font-bold text-gray-900">Dashboard Admin</h1>
          </div>
          <p className="text-sm text-gray-500 ml-3">Ringkasan data dan akses cepat sistem pertanian</p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-green-50 hover:text-green-700 hover:border-green-200 font-medium transition-all duration-150 gap-2 shadow-sm text-sm">
          <FileDown className="w-4 h-4" />
          Export Laporan (.xlsx)
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <StatCard 
          title="Total Petani & Peternak" 
          value={loading ? '...' : stats.totalPetani} 
          subtitle="Orang terdaftar aktif"
          icon={Users} 
          accentColor="#2563eb"
          bgColor="#eff6ff"
        />
        <StatCard 
          title="Total Luas Lahan" 
          value={loading ? '...' : `${stats.totalLahan} Ha`}
          subtitle="Dikelola oleh masyarakat"
          icon={Map} 
          accentColor="#16a34a"
          bgColor="#f0fdf4"
        />
        <StatCard 
          title="Total Populasi Ternak" 
          value={loading ? '...' : `${stats.totalTernak} Ekor`}
          subtitle="Sapi, Kambing, Ayam, dll"
          icon={Tractor} 
          accentColor="#a07d70"
          bgColor="#fdf8f6"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Akses Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QuickActionButton 
            to="/admin/petani"
            title="Kelola Data Petani"
            desc="Data master pemilik lahan pertanian"
            icon={Sprout}
            gradientFrom="#16a34a"
            gradientTo="#22c55e"
          />
          <QuickActionButton 
            to="/admin/peternak"
            title="Kelola Data Peternak"
            desc="Data master pemilik dan populasi ternak"
            icon={Tractor}
            gradientFrom="#a07d70"
            gradientTo="#d2bab0"
          />
        </div>
      </div>

      {/* Charts */}
      <div>
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Grafik Statistik</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          
          {/* Pie Chart Komoditas */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-gray-900">Sebaran Komoditas Pertanian</h3>
              <span className="text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full font-medium">Real-time</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.komoditasPertanian.length > 0 ? stats.komoditasPertanian : [{name: 'Belum ada data', value: 1}]}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {(stats.komoditasPertanian.length > 0 ? stats.komoditasPertanian : [{name: 'Belum ada data', value: 1}]).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={stats.komoditasPertanian.length > 0 ? COLORS[index % COLORS.length] : '#e5e7eb'} stroke="none" />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '13px', paddingTop: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart Lahan */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-gray-900">Total Luas Lahan per Komoditas</h3>
              <span className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full font-medium">Satuan: Ha</span>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.lahanKomoditas} margin={{ top: 5, right: 5, left: -20, bottom: 0 }} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 500}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                  <Bar dataKey="lahan" name="Luas Lahan (Ha)" radius={[6, 6, 0, 0]}>
                    {stats.lahanKomoditas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name.toLowerCase() === 'padi' ? '#f59e0b' : '#22c55e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart Ternak - full width */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
              <h3 className="text-sm font-semibold text-gray-900">Proporsi Jenis Ternak</h3>
              <span className="text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full mt-2 sm:mt-0 font-medium">Data diperbarui: Hari ini</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.jenisTernak.length > 0 ? stats.jenisTernak : [{name: 'Belum ada data', value: 1}]}
                      cx="50%"
                      cy="50%"
                      outerRadius={95}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {(stats.jenisTernak.length > 0 ? stats.jenisTernak : [{name: 'Belum ada data', value: 1, color: '#e5e7eb'}]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#e5e7eb'} stroke="none" />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.1)', fontSize: '13px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-col justify-center">
                {stats.jenisTernak.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center">Belum ada data peternak.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.jenisTernak.map((ternak, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: ternak.color }}></div>
                          <span className="text-sm font-medium text-gray-800">{ternak.name}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{ternak.value.toLocaleString()} <span className="text-xs font-normal text-gray-400">ekor</span></span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
