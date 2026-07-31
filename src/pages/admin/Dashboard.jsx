import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Sprout, Tractor, Plus, FileDown } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { mockStats, komoditasPertanian, estimasiProduksi, jenisTernak } from '../../data/mockData';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6', '#a07d70'];

const QuickActionButton = ({ to, icon: Icon, title, desc, colorClass }) => (
  <Link to={to} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex items-start gap-4 group">
    <div className={`p-4 rounded-xl ${colorClass} group-hover:scale-105 transition-transform`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{desc}</p>
    </div>
  </Link>
);

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between">
    <div>
      <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
    <div className={`p-4 rounded-full ${colorClass}`}>
      <Icon className="w-8 h-8" />
    </div>
  </div>
);

const AdminDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-gray-500 mt-1">Ringkasan data dan akses cepat</p>
        </div>
        <button className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:text-green-600 font-medium transition-colors gap-2 shadow-sm">
          <FileDown className="w-5 h-5" />
          Export Laporan (.xlsx)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Petani / Peternak" 
          value={mockStats.totalPetani} 
          icon={Users} 
          colorClass="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          title="Total Luas Lahan (Ha)" 
          value={mockStats.totalLahan} 
          icon={Sprout} 
          colorClass="bg-green-50 text-green-600" 
        />
        <StatCard 
          title="Total Populasi Ternak" 
          value={mockStats.totalTernak} 
          icon={Tractor} 
          colorClass="bg-earth-50 text-earth-600" 
        />
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Akses Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuickActionButton 
            to="/admin/petani"
            title="Kelola Data Petani"
            desc="Data master pemilik lahan pertanian."
            icon={Users}
            colorClass="bg-blue-50 text-blue-600"
          />
          <QuickActionButton 
            to="/admin/peternak"
            title="Kelola Data Peternak"
            desc="Data master pemilik ternak."
            icon={Users}
            colorClass="bg-blue-50 text-blue-600"
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Grafik Statistik</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Sebaran Komoditas Pertanian</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={komoditasPertanian}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {komoditasPertanian.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Estimasi Produksi Panen (Ton)</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={estimasiProduksi} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} />
                  <RechartsTooltip cursor={{fill: '#f9fafb'}} />
                  <Legend />
                  <Bar dataKey="Padi" stackId="a" fill="#22c55e" radius={[0, 0, 4, 4]} />
                  <Bar dataKey="Jagung" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="Cabai" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

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
                      data={jenisTernak}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {jenisTernak.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="flex flex-col justify-center">
                <div className="space-y-4">
                  {jenisTernak.map((ternak, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ternak.color }}></div>
                        <span className="font-medium text-gray-900">{ternak.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-gray-500 text-sm">
                          Jantan: <span className="font-semibold text-gray-900">{Math.round(ternak.value * 0.3)}</span>
                        </span>
                        <span className="text-gray-500 text-sm">
                          Betina: <span className="font-semibold text-gray-900">{Math.round(ternak.value * 0.7)}</span>
                        </span>
                        <span className="font-bold text-gray-900 ml-2">{ternak.value} Ekor</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
