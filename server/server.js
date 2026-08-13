const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// KONFIGURASI DATABASE DIPERBARUI UNTUK VERCEL / NEON
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database
const initDb = async () => {
  try {
    // Note: Creating database from pg connection to the same database can fail if it doesn't exist.
    // For this prototype, we'll assume the user has created the 'db_pertanian_peternakan' database.
    // We will just create the table.
    await pool.query(`
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
    `);
    console.log('Database initialized successfully');
  } catch (err) {
    console.error('Error initializing database:', err);
  }
};

initDb();

// Routes
app.get('/api/petani', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM petani ORDER BY id DESC');
    // map snake_case back to camelCase for frontend
    const mapped = result.rows.map(row => ({
      id: row.id,
      nik: row.nik,
      nama: row.nama,
      alamat: row.alamat,
      jk: row.jk,
      kategoriLahan: row.kategori_lahan,
      komoditas: row.komoditas,
      luasLahan: row.luas_lahan,
      kelompokTani: row.kelompok_tani
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/petani', async (req, res) => {
  const { nik, nama, alamat, jk, kategoriLahan, komoditas, luasLahan, kelompokTani } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO petani (nik, nama, alamat, jk, kategori_lahan, komoditas, luas_lahan, kelompok_tani) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [nik, nama, alamat, jk, kategoriLahan, komoditas, luasLahan ? parseFloat(luasLahan) : null, kelompokTani]
    );
    res.status(201).json({
      id: result.rows[0].id,
      nik: result.rows[0].nik,
      nama: result.rows[0].nama,
      alamat: result.rows[0].alamat,
      jk: result.rows[0].jk,
      kategoriLahan: result.rows[0].kategori_lahan,
      komoditas: result.rows[0].komoditas,
      luasLahan: result.rows[0].luas_lahan,
      kelompokTani: result.rows[0].kelompok_tani
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/petani/:id', async (req, res) => {
  const { id } = req.params;
  const { nik, nama, alamat, jk, kategoriLahan, komoditas, luasLahan, kelompokTani } = req.body;
  try {
    const result = await pool.query(
      'UPDATE petani SET nik = $1, nama = $2, alamat = $3, jk = $4, kategori_lahan = $5, komoditas = $6, luas_lahan = $7, kelompok_tani = $8 WHERE id = $9 RETURNING *',
      [nik, nama, alamat, jk, kategoriLahan, komoditas, luasLahan ? parseFloat(luasLahan) : null, kelompokTani, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/petani/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM petani WHERE id = $1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete all
app.delete('/api/petani', async (req, res) => {
  try {
    await pool.query('TRUNCATE TABLE petani RESTART IDENTITY');
    res.json({ message: 'All data deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Import multiple
app.post('/api/petani/import', async (req, res) => {
  const data = req.body; // Expecting array of petani objects
  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  
  try {
    await pool.query('BEGIN');
    for (const item of data) {
      await pool.query(
        'INSERT INTO petani (nik, nama, alamat, jk, kategori_lahan, komoditas, luas_lahan, kelompok_tani) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [item.nik, item.nama, item.alamat, item.jk, item.kategoriLahan, item.komoditas, item.luasLahan ? parseFloat(item.luasLahan) : null, item.kelompokTani]
      );
    }
    await pool.query('COMMIT');
    res.status(201).json({ message: 'Import successful' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Peternak Endpoints ---

app.get('/api/peternak', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM peternak ORDER BY id DESC');
    const mapped = result.rows.map(row => ({
      id: row.id,
      nik: row.nik,
      nama: row.nama,
      alamat: row.alamat,
      jk: row.jk,
      kategoriLahan: row.kategori_lahan,
      jenisTernak: row.jenis_ternak,
      luasLahan: row.luas_lahan,
      jumlahTernak: row.jumlah_ternak,
      kendala: row.kendala
    }));
    res.json(mapped);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/peternak', async (req, res) => {
  const { nik, nama, alamat, jk, kategoriLahan, jenisTernak, luasLahan, jumlahTernak, kendala } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO peternak (nik, nama, alamat, jk, kategori_lahan, jenis_ternak, luas_lahan, jumlah_ternak, kendala) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [nik, nama, alamat, jk, kategoriLahan, jenisTernak, luasLahan ? parseFloat(luasLahan) : null, jumlahTernak ? parseInt(jumlahTernak) : 0, kendala]
    );
    res.status(201).json({
      id: result.rows[0].id,
      nik: result.rows[0].nik,
      nama: result.rows[0].nama,
      alamat: result.rows[0].alamat,
      jk: result.rows[0].jk,
      kategoriLahan: result.rows[0].kategori_lahan,
      jenisTernak: result.rows[0].jenis_ternak,
      luasLahan: result.rows[0].luas_lahan,
      jumlahTernak: result.rows[0].jumlah_ternak,
      kendala: result.rows[0].kendala
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/peternak/:id', async (req, res) => {
  const { id } = req.params;
  const { nik, nama, alamat, jk, kategoriLahan, jenisTernak, luasLahan, jumlahTernak, kendala } = req.body;
  try {
    const result = await pool.query(
      'UPDATE peternak SET nik = $1, nama = $2, alamat = $3, jk = $4, kategori_lahan = $5, jenis_ternak = $6, luas_lahan = $7, jumlah_ternak = $8, kendala = $9 WHERE id = $10 RETURNING *',
      [nik, nama, alamat, jk, kategoriLahan, jenisTernak, luasLahan ? parseFloat(luasLahan) : null, jumlahTernak ? parseInt(jumlahTernak) : 0, kendala, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/peternak/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM peternak WHERE id = $1', [id]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/peternak', async (req, res) => {
  try {
    await pool.query('TRUNCATE TABLE peternak RESTART IDENTITY');
    res.json({ message: 'All data deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/stats', async (req, res) => {
    try {
        const totalPetaniResult = await pool.query('SELECT COUNT(*) FROM petani');
        const totalPetaniCount = parseInt(totalPetaniResult.rows[0].count);
        
        const totalPeternakResult = await pool.query('SELECT COUNT(*) FROM peternak');
        const totalPeternakCount = parseInt(totalPeternakResult.rows[0].count);

        const totalPetani = totalPetaniCount + totalPeternakCount;
        
        const totalLahanPetaniResult = await pool.query('SELECT SUM(luas_lahan) FROM petani');
        const totalLahanPeternakResult = await pool.query('SELECT SUM(luas_lahan) FROM peternak');
        const totalLahan = (parseFloat(totalLahanPetaniResult.rows[0].sum) || 0) + (parseFloat(totalLahanPeternakResult.rows[0].sum) || 0);
        
        const komoditasResult = await pool.query('SELECT komoditas as name, COUNT(*) as value FROM petani GROUP BY komoditas');
        const komoditas = komoditasResult.rows.map(row => ({
            name: row.name || 'Tidak ada',
            value: parseInt(row.value)
        }));

        const lahanKomoditasResult = await pool.query('SELECT komoditas as name, SUM(luas_lahan) as total_lahan FROM petani GROUP BY komoditas');
        const lahanKomoditas = lahanKomoditasResult.rows.map(row => ({
            name: row.name || 'Tidak ada',
            lahan: parseFloat(row.total_lahan) || 0
        }));

        const ternakResult = await pool.query('SELECT jenis_ternak as name, SUM(jumlah_ternak) as value FROM peternak GROUP BY jenis_ternak');
        
        // Define some preset colors for pie chart
        const colors = ['#16a34a', '#a07d70', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6'];
        
        const ternak = ternakResult.rows.map((row, index) => ({
            name: row.name || 'Tidak ada',
            value: parseInt(row.value) || 0,
            color: colors[index % colors.length]
        }));
        
        const totalTernakResult = await pool.query('SELECT SUM(jumlah_ternak) FROM peternak');
        const totalTernak = parseInt(totalTernakResult.rows[0].sum) || 0;

        res.json({
            totalPetani,
            totalLahan: totalLahan.toFixed(1),
            totalTernak: totalTernak,
            komoditasPertanian: komoditas,
            lahanKomoditas: lahanKomoditas,
            jenisTernak: ternak
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});