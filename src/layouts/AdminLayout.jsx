import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Tractor, LogOut, Menu, X, Sprout } from 'lucide-react';

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Data Petani', path: '/admin/petani', icon: Sprout },
    { name: 'Data Peternak', path: '/admin/peternak', icon: Tractor },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  const SidebarContent = () => (
    <>
      {/* Logo area */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-green-800/30">
        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
          <Sprout className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-tight">Admin Desa</h1>
          <p className="text-xs text-green-300 font-medium">Sistem Pertanian</p>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.includes(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-150 ${
                isActive
                  ? 'bg-white/20 text-white shadow-sm'
                  : 'text-green-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon className={`mr-3 h-4.5 w-4.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-green-300'}`} />
              {item.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-green-800/30">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-green-200 rounded-xl hover:bg-white/10 hover:text-white transition-all duration-150"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Keluar
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar - Desktop */}
      <aside className="hidden w-60 md:flex md:flex-col gradient-brand shadow-xl flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <nav className="relative flex flex-col w-72 h-full gradient-brand shadow-2xl">
            <div className="flex items-center justify-between px-6 py-5 border-b border-green-800/30">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sprout className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-base font-bold text-white">Admin Desa</h1>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-green-200 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.includes(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all ${
                      isActive ? 'bg-white/20 text-white' : 'text-green-200 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className={`mr-3 h-4 w-4 ${isActive ? 'text-white' : 'text-green-300'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile Header */}
        <header className="flex items-center justify-between h-14 px-4 bg-white border-b border-gray-100 shadow-sm md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-base font-bold text-gray-900">Admin Desa</h1>
          </div>
          <div className="w-8" />
        </header>

        {/* Main section */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

