import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import Landing from './pages/Landing';
import PublicDashboard from './pages/PublicDashboard';
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import DataPetani from './pages/admin/DataPetani';
import DataPeternak from './pages/admin/DataPeternak';

// Layouts
import AdminLayout from './layouts/AdminLayout';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/statistik" element={<PublicDashboard />} />
          <Route path="/login" element={<Login />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="petani" element={<DataPetani />} />
            <Route path="peternak" element={<DataPeternak />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
