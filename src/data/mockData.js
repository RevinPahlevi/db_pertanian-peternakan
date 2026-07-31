export const mockStats = {
  totalPetani: 145,
  totalLahan: 230.5,
  totalTernak: 1250,
  estimasiPanen: 45.2
};

export const komoditasPertanian = [
  { name: 'Padi', value: 45 },
  { name: 'Jagung', value: 25 },
  { name: 'Cabai', value: 15 },
  { name: 'Sayuran', value: 15 },
];

export const estimasiProduksi = [
  { name: 'Jan', Padi: 40, Jagung: 24, Cabai: 12 },
  { name: 'Feb', Padi: 30, Jagung: 13, Cabai: 22 },
  { name: 'Mar', Padi: 20, Jagung: 58, Cabai: 18 },
  { name: 'Apr', Padi: 27, Jagung: 39, Cabai: 15 },
  { name: 'May', Padi: 18, Jagung: 48, Cabai: 14 },
  { name: 'Jun', Padi: 23, Jagung: 38, Cabai: 25 },
];

export const jenisTernak = [
  { name: 'Sapi', value: 300, color: '#16a34a' },
  { name: 'Kambing', value: 450, color: '#a07d70' },
  { name: 'Ayam', value: 350, color: '#f59e0b' },
  { name: 'Bebek', value: 150, color: '#3b82f6' },
];

export const mockPetani = [
  { id: 1, nik: '3201234567890001', nama: 'Budi Santoso', alamat: 'Dusun Sukamaju', jk: 'Laki-laki', kategoriLahan: 'Pribadi', komoditas: 'Padi', luasLahan: 1.5, kendala: 'Hama Wereng' },
  { id: 2, nik: '3201234567890002', nama: 'Siti Aminah', alamat: 'Dusun Makmur', jk: 'Perempuan', kategoriLahan: 'Penggarap', komoditas: 'Cabai', luasLahan: 0.8, kendala: 'Kurang Air' },
];

export const mockPeternak = [
  { id: 1, nik: '3201234567890003', nama: 'Ahmad Yani', alamat: 'Dusun Sukamaju', jk: 'Laki-laki', kategoriLahan: 'Pribadi', jenisTernak: 'Sapi', luasLahan: 2.1, kendala: 'Pakan Mahal' },
  { id: 2, nik: '3201234567890004', nama: 'Budi Santoso', alamat: 'Dusun Sukamaju', jk: 'Laki-laki', kategoriLahan: 'Pribadi', jenisTernak: 'Kambing', luasLahan: 1.5, kendala: 'Penyakit Kuku' },
];

export const mockPertanian = [
  { id: 1, petaniId: 1, namaPetani: 'Budi Santoso', komoditas: 'Padi', tglTanam: '2024-01-15', tglPanen: '2024-04-15', status: 'Menanam', estimasiHasil: 1200 },
  { id: 2, petaniId: 2, namaPetani: 'Siti Aminah', komoditas: 'Cabai', tglTanam: '2024-02-10', tglPanen: '2024-05-10', status: 'Siap Panen', estimasiHasil: 450 },
];

export const mockPeternakan = [
  { id: 1, peternakId: 1, namaPeternak: 'Ahmad Yani', jenis: 'Sapi', jantan: 5, betina: 15, status: 'Sehat' },
  { id: 2, peternakId: 2, namaPeternak: 'Budi Santoso', jenis: 'Kambing', jantan: 10, betina: 25, status: 'Sehat' },
];
