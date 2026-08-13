import pandas as pd
import psycopg2
import os
import glob

# 1. URL Database Neon Anda
NEON_DATABASE_URL = "postgresql://neondb_owner:npg_tYlcBUX6y5rs@ep-super-hill-atf6daa5.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Mapping Kolom
kolom_dibutuhkan = {
    'no': 'Nomor',
    'nama': 'Nama',
    'nik': 'NIK',
    'alamat': 'Alamat',
    'jeniskelamin': 'Jenis Kelamin',
    'komoditasyangdiusahakan(1)': 'Komoditas',
    'volume(ha,ekor,unit)': 'Volume (Hektar)',
    'kategoripetani': 'Kategori Petani (Pemilik/Penggarap)'
}

def fix_nik(x):
    if pd.isna(x):
        return "-"
    try:
        return str(int(float(x)))
    except:
        return str(x)

print("🔍 Mencari file Excel kelompok tani di komputer Anda...")

# Cari semua file .xls yang diawali kata 'Kelompok' di seluruh folder proyek & sub-folder
files_found = glob.glob("**/Kelompok*.xls", recursive=True) + glob.glob("Kelompok*.xls")
files_found = list(set(files_found))

if not files_found:
    user_download_path = os.path.expanduser("~/Downloads")
    files_found = glob.glob(os.path.join(user_download_path, "Kelompok*.xls"))

print(f"📁 Ditemukan {len(files_found)} file Excel:")
for f in files_found:
    print(f"  - {f}")

semua_data = []

for file_path in files_found:
    try:
        df = pd.read_excel(file_path, header=8)
        df.columns = df.columns.astype(str).str.replace(r'\s+', '', regex=True).str.lower()
        
        kolom_tersedia = [k for k in kolom_dibutuhkan.keys() if k in df.columns]
        df_filtered = df[kolom_tersedia].copy()
        df_filtered = df_filtered.rename(columns=kolom_dibutuhkan)
        
        if 'Nama' in df_filtered.columns:
            df_filtered = df_filtered.dropna(subset=['Nama'])
            
        if 'NIK' in df_filtered.columns:
            df_filtered['NIK'] = df_filtered['NIK'].apply(fix_nik)
            
        file_name = os.path.basename(file_path)
        nama_kelompok = file_name.replace(".xls", "").strip()
        df_filtered['Kelompok Tani'] = nama_kelompok
        
        semua_data.append(df_filtered)
        print(f"  ✅ Sukses membaca: {file_name} ({len(df_filtered)} baris)")
    except Exception as e:
        print(f"  ❌ Gagal membaca {file_path}: {e}")

if not semua_data:
    print("\n❌ Tidak ada data yang berhasil dibaca. Pastikan file 'Kelompok Tani...xls' tersimpan di laptop Anda.")
    exit()

df_master = pd.concat(semua_data, ignore_index=True)
print(f"\n✨ Total data terkumpul: {len(df_master)} petani.")

# 2. Unggah ke Database Neon Cloud
try:
    print("\nMenghubungkan ke Neon Cloud Database...")
    conn = psycopg2.connect(NEON_DATABASE_URL)
    cursor = conn.cursor()
    print("✅ Berhasil terhubung ke Neon Cloud!")

    # Buat tabel petani & peternak jika belum ada
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS petani (
            id SERIAL PRIMARY KEY,
            nik VARCHAR(50),
            nama VARCHAR(100),
            alamat TEXT,
            jk VARCHAR(20),
            kategori_lahan VARCHAR(50),
            komoditas VARCHAR(100),
            luas_lahan FLOAT,
            kelompok_tani VARCHAR(150)
        );

        CREATE TABLE IF NOT EXISTS peternak (
            id SERIAL PRIMARY KEY,
            nik VARCHAR(50),
            nama VARCHAR(100),
            alamat TEXT,
            jk VARCHAR(20),
            kategori_lahan VARCHAR(50),
            jenis_ternak VARCHAR(100),
            luas_lahan FLOAT,
            jumlah_ternak INTEGER,
            kendala TEXT
        );
    """)

    # Reset isi tabel agar bersih
    cursor.execute("TRUNCATE TABLE petani RESTART IDENTITY;")
    cursor.execute("TRUNCATE TABLE peternak RESTART IDENTITY;")
    print("Mulai memasukkan data ke Neon...")

    # Insert Data Petani
    for index, row in df_master.iterrows():
        nik = str(row.get("NIK", "-"))
        nama = str(row.get("Nama", "-"))
        alamat = str(row.get("Alamat", "-"))
        jk = str(row.get("Jenis Kelamin", "-"))
        kategori = str(row.get("Kategori Petani (Pemilik/Penggarap)", "-"))
        komoditas = str(row.get("Komoditas", "-"))
        
        luas_val = row.get("Volume (Hektar)", 0)
        luas = float(luas_val) if pd.notna(luas_val) else 0.0
        
        kelompok = str(row.get("Kelompok Tani", "-"))

        cursor.execute("""
            INSERT INTO petani (nik, nama, alamat, jk, kategori_lahan, komoditas, luas_lahan, kelompok_tani)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (nik, nama, alamat, jk, kategori, komoditas, luas, kelompok))

    # Insert Data Dummy Peternak (Agar query statistik peternak tidak error / berputar)
    sample_peternak = [
        ('130516000001', 'Ahmad Peternak', 'Kampung Tanjung', 'Laki-laki', 'Pribadi', 'Sapi', 0.5, 5, 'Pakan mahal'),
        ('130516000002', 'Siti Peternak', 'Sawah Tuko', 'Perempuan', 'Pribadi', 'Kambing', 0.2, 10, 'Penyakit ternak')
    ]
    for p in sample_peternak:
        cursor.execute("""
            INSERT INTO peternak (nik, nama, alamat, jk, kategori_lahan, jenis_ternak, luas_lahan, jumlah_ternak, kendala)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, p)

    conn.commit()
    cursor.close()
    conn.close()
    
    print("\n🎉 SUKSES BESAR! Tabel 'petani' & 'peternak' beserta seluruh data berhasil diunggah ke Neon Cloud Database!")
    print("Silakan buka/refresh website Vercel Anda sekarang.")

except Exception as e:
    print(f"\n❌ Terjadi kesalahan saat mengunggah ke Neon: {e}")