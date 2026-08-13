import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, Edit2, Trash2, X, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

const DataPetani = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKelompok, setFilterKelompok] = useState('Semua');
  const [filterKomoditas, setFilterKomoditas] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/api/petani');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Form State
  const [formData, setFormData] = useState({ 
    id: null, 
    nik: '', 
    nama: '', 
    alamat: '', 
    jk: 'Laki-laki', 
    kategoriLahan: 'Pribadi', 
    komoditas: '', 
    luasLahan: '',
    kelompokTani: ''
  });

  const filteredData = data.filter(item => {
    const matchSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) || item.nik.includes(searchTerm);
    const matchKelompok = filterKelompok === 'Semua' || item.kelompokTani === filterKelompok;
    const matchKomoditas = filterKomoditas === 'Semua' || item.komoditas === filterKomoditas;
    return matchSearch && matchKelompok && matchKomoditas;
  });

  // Extract unique values for filters
  const uniqueKelompok = ['Semua', ...new Set(data.map(item => item.kelompokTani).filter(Boolean))];
  const uniqueKomoditas = ['Semua', ...new Set(data.map(item => item.komoditas).filter(Boolean))];

  const handleOpenModal = (petani = null) => {
    if (petani) {
      setFormData(petani);
    } else {
      setFormData({ 
        id: null, 
        nik: '', 
        nama: '', 
        alamat: '', 
        jk: 'Laki-laki', 
        kategoriLahan: 'Pribadi', 
        komoditas: '', 
        luasLahan: '',
        kelompokTani: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = formData.id ? `http://localhost:5000/api/petani/${formData.id}` : 'http://localhost:5000/api/petani';
      const method = formData.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        fetchData();
        setIsModalOpen(false);
      } else {
        alert('Gagal menyimpan data');
      }
    } catch (error) {
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Yakin ingin menghapus data ini?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/petani/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setData(data.filter(item => item.id !== id));
        }
      } catch (error) {
        console.error('Error deleting:', error);
      }
    }
  };

  const handleDeleteAll = async () => {
    if(window.confirm('PERINGATAN: Apakah Anda yakin ingin menghapus SEMUA data petani? Tindakan ini tidak dapat dibatalkan!')) {
      try {
        const response = await fetch('http://localhost:5000/api/petani', { method: 'DELETE' });
        if (response.ok) {
          setData([]);
          alert('Semua data berhasil dihapus.');
        } else {
          alert('Gagal menghapus semua data.');
        }
      } catch (error) {
        console.error('Error deleting all:', error);
      }
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        // Use raw: false to get formatted text (handles exponential NIK better if formatted in excel)
        const data = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false });
        
        const importedData = [];
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          if (!row || row.length === 0) continue;
          
          const nama = row[1];
          if (!nama) continue;
          
          let kelompokTani = row[2] ? String(row[2]) : '';
          let nikStr = row[3] ? String(row[3]).replace(/,/g, '') : '';
          
          const statusRaw = row[8] ? String(row[8]).toLowerCase() : '';
          let kategoriLahan = 'Pribadi';
          if (statusRaw.includes('penggarap') && !statusRaw.includes('pemilik')) {
              kategoriLahan = 'Penggarap';
          } else if (statusRaw.includes('pemilik')) {
              kategoriLahan = 'Pribadi';
          }
          
          let luasLahanVal = row[7] ? String(row[7]).replace(',', '.') : '';
          
          importedData.push({
            id: Date.now() + i,
            nik: nikStr,
            nama: String(row[1]),
            alamat: row[4] ? String(row[4]) : '',
            jk: (row[5] && String(row[5]).toLowerCase().includes('perempuan')) ? 'Perempuan' : 'Laki-laki',
            kategoriLahan: kategoriLahan,
            komoditas: row[6] ? String(row[6]) : '',
            luasLahan: luasLahanVal,
            kelompokTani: kelompokTani
          });
        }
        
        if (importedData.length > 0) {
            try {
              const response = await fetch('http://localhost:5000/api/petani/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(importedData)
              });
              if (response.ok) {
                fetchData();
                alert(`Berhasil mengimpor ${importedData.length} data.`);
              } else {
                alert('Gagal menyimpan data import ke server.');
              }
            } catch (error) {
               console.error('Error importing:', error);
               alert('Terjadi kesalahan koneksi saat import.');
            }
        } else {
            alert('Tidak ada data yang valid ditemukan pada file.');
        }
      } catch (error) {
        console.error('Error importing file:', error);
        alert('Terjadi kesalahan saat mengimpor file.');
      }
      
      if (fileInputRef.current) {
          fileInputRef.current.value = '';
      }
    };
    reader.readAsBinaryString(file);
  };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Data Pemilik Pertanian</h1>
          <p className="text-gray-500 mt-1">Kelola data kepemilikan lahan dan komoditas pertanian.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleDeleteAll}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Trash2 className="w-5 h-5" />
            Hapus Semua
          </button>
          <input 
            type="file" 
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImport}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Upload className="w-5 h-5" />
            Import Data
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            Tambah Data
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Cari nama atau NIK..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <select
              value={filterKelompok}
              onChange={(e) => setFilterKelompok(e.target.value)}
              className="block w-full md:w-48 pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              {uniqueKelompok.map((kelompok, idx) => (
                <option key={idx} value={kelompok}>
                  {kelompok === 'Semua' ? 'Semua Kelompok Tani' : kelompok}
                </option>
              ))}
            </select>
            <select
              value={filterKomoditas}
              onChange={(e) => setFilterKomoditas(e.target.value)}
              className="block w-full md:w-40 pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              {uniqueKomoditas.map((komoditas, idx) => (
                <option key={idx} value={komoditas}>
                  {komoditas === 'Semua' ? 'Semua Komoditas' : komoditas}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NIK</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kelompok Tani</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">L/P</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kepemilikan Lahan</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Komoditas</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Luas Lahan (Ha)</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length > 0 ? filteredData.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.nik}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nama}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.kelompokTani || '-'}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.alamat}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.jk === 'Laki-laki' ? 'L' : 'P'}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.kategoriLahan === 'Pribadi' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {item.kategoriLahan}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.komoditas}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.luasLahan}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(item)} className="text-amber-600 hover:text-amber-900">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="10" className="px-4 py-8 text-center text-gray-500">Tidak ada data ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setIsModalOpen(false)}></div>
            
            <div className="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {formData.id ? 'Edit Data Pemilik Pertanian' : 'Tambah Data Pemilik Pertanian'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
                  <input type="text" required value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input type="text" required value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kelompok Tani (Opsional)</label>
                  <input type="text" value={formData.kelompokTani} onChange={e => setFormData({...formData, kelompokTani: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
                  <input type="text" required value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelamin</label>
                  <select required value={formData.jk} onChange={e => setFormData({...formData, jk: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm">
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kategori Kepemilikan Lahan</label>
                  <select required value={formData.kategoriLahan} onChange={e => setFormData({...formData, kategoriLahan: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm">
                    <option value="Pribadi">Pribadi</option>
                    <option value="Penggarap">Penggarap</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Komoditas</label>
                  <input type="text" required value={formData.komoditas} onChange={e => setFormData({...formData, komoditas: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Luas Lahan (Ha)</label>
                  <input type="number" step="0.01" required value={formData.luasLahan} onChange={e => setFormData({...formData, luasLahan: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 sm:text-sm" />
                </div>
                
                <div className="md:col-span-2 mt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none">
                    Batal
                  </button>
                  <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 focus:outline-none">
                    Simpan Data
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPetani;
