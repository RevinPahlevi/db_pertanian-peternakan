import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { ArrowLeft, Users, Map, Tractor } from 'lucide-react';
import bgImage from '../assets/background.jpg';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#a07d70', '#8b5cf6'];

const StatCard = ({ title, value, subtitle, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4">
    <div className={`p-4 rounded-xl ${colorClass}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const PublicDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('semua');
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
    .then((res) => res.json())
    .then((data) => setStats(data))
    .catch((err) => console.error(err));
}, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-green-700 font-medium">Memuat Data Statistik...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header with background */}
      <header
        className="relative bg-white border-b border-gray-200 sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-gray-900">Statistik Desa</h1>
          </div>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setFilter('semua')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'semua' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Semua
            </button>
            <button 
              onClick={() => setFilter('pertanian')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'pertanian' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Pertanian
            </button>
            <button 
              onClick={() => setFilter('peternakan')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${filter === 'peternakan' ? 'bg-white text-green-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              Peternakan
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner with background */}
      <div
        className="relative h-44 flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 60%',
        }}
      >
        <div className="absolute inset-0 bg-green-900/50" />
        <div className="relative z-10 text-center">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Data Statistik Desa</h2>
          <p className="text-green-200 mt-2 text-sm">Visualisasi data pertanian dan peternakan secara real-time</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard 
            title="Total Petani & Peternak" 
            value={stats.totalPetani} 
            subtitle="Orang terdaftar aktif"
            icon={Users} 
            colorClass="bg-blue-50 text-blue-600" 
          />
          <StatCard 
            title="Total Luas Lahan" 
            value={`${stats.totalLahan} Ha`} 
            subtitle="Dikelola oleh masyarakat"
            icon={Map} 
            colorClass="bg-green-50 text-green-600" 
          />
          <StatCard 
            title="Total Populasi Ternak" 
            value={`${stats.totalTernak} Ekor`} 
            subtitle="Sapi, Kambing, Ayam, dll"
            icon={Tractor} 
            colorClass="bg-earth-50 text-earth-600" 
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Chart Pertanian */}
          {(filter === 'semua' || filter === 'pertanian') && (
            <>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Sebaran Komoditas Pertanian</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.komoditasPertanian.length > 0 ? stats.komoditasPertanian : [{name: 'Belum ada data', value: 1}]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {(stats.komoditasPertanian.length > 0 ? stats.komoditasPertanian : [{name: 'Belum ada data', value: 1}]).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={stats.komoditasPertanian.length > 0 ? COLORS[index % COLORS.length] : '#e5e7eb'} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Total Luas Lahan (Ha) per Komoditas</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.lahanKomoditas} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                      <RechartsTooltip cursor={{fill: '#f9fafb'}} />
                      <Legend />
                      <Bar dataKey="lahan" name="Luas Lahan (Ha)" radius={[4, 4, 0, 0]}>
                        {stats.lahanKomoditas.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.name.toLowerCase() === 'padi' ? '#f59e0b' : '#22c55e'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {/* Chart Peternakan */}
          {(filter === 'semua' || filter === 'peternakan') && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm lg:col-span-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">Proporsi Jenis Ternak & Status</h3>
                <span className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full mt-2 sm:mt-0 font-medium">Data diperbarui: Hari ini</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.jenisTernak.length > 0 ? stats.jenisTernak : [{name: 'Belum ada data', value: 1}]}
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {(stats.jenisTernak.length > 0 ? stats.jenisTernak : [{name: 'Belum ada data', value: 1, color: '#e5e7eb'}]).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || '#e5e7eb'} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex flex-col justify-center">
                  <div className="space-y-4">
                    {stats.jenisTernak.map((ternak, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ternak.color }}></div>
                          <span className="font-medium text-gray-900">{ternak.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900 ml-2">{ternak.value} Ekor</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default PublicDashboard;
