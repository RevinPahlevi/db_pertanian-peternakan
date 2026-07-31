import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, BarChart3, Users, ShieldCheck } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/80 backdrop-blur-md fixed w-full z-10 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-green-600" />
            <span className="font-bold text-xl text-gray-900 tracking-tight">AgroData Desa</span>
          </div>
          <div>
            <Link 
              to="/login" 
              className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
            >
              Login Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex items-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-700 text-sm font-medium mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Sistem Informasi Desa Terpadu
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
              Database Pertanian & <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-earth-600">
                Peternakan Desa
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Platform visualisasi data dan pencatatan komoditas pertanian serta peternakan untuk mendukung ketahanan pangan dan kesejahteraan petani lokal.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/statistik" 
                className="w-full sm:w-auto px-8 py-4 bg-green-600 text-white rounded-xl font-semibold text-lg hover:bg-green-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-5 h-5" />
                Lihat Data Statistik Desa
              </Link>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-colors">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Visualisasi Akurat</h3>
              <p className="text-gray-600 leading-relaxed">Pantau perkembangan produksi hasil panen dan populasi ternak melalui grafik interaktif yang mudah dipahami.</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-earth-200 hover:bg-earth-50/50 transition-colors">
              <div className="w-12 h-12 bg-earth-100 text-earth-600 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Data Terpusat</h3>
              <p className="text-gray-600 leading-relaxed">Pencatatan data petani, peternak, dan kelompok tani (Gapoktan) secara terstruktur dalam satu platform.</p>
            </div>
            
            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:border-green-200 hover:bg-green-50/50 transition-colors">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Transparan & Valid</h3>
              <p className="text-gray-600 leading-relaxed">Memudahkan perangkat desa dalam menyusun laporan dan mengambil kebijakan berbasis data yang akurat.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-100">
        <p>&copy; {new Date().getFullYear()} Sistem Informasi Desa. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
