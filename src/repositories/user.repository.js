const pool = require('../database/pg.database');

// REGISTER
exports.registerUser = async (username, email, hashedPassword) => {
  const result = await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
    [username, email, hashedPassword]
  );
  return result.rows[0];
};

// LOGIN
exports.loginUser = async (email, password) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND password = $2',
    [email, password]
  );
  return result.rows[0];
};

// GET USER BY EMAIL
exports.getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

// UPDATE
exports.updateUser = async (id, name, email, password) => {
  const result = await pool.query(
    'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
    [name, email, password, id]
  );
  return result.rows[0];
};

// DELETE
exports.deleteUser = async (id) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

// Ambil user berdasarkan ID dari database
exports.getUserById = async (id) => {
    try {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return result.rows[0];
    } catch (error) {
        console.error('Error in getUserById:', error);
        throw error;
    }
};

// Perbaiki fungsi ini di user.repository.js
exports.updateUserBalance = async (id, newBalance) => {
  try {
    const query = 'UPDATE users SET balance = $1 WHERE id = $2 RETURNING *';
    const values = [newBalance, id];
    
    const result = await pool.query(query, values); // Ganti db.query dengan pool.query
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user balance:', error);
    throw error;
  }
};

// Tambahkan fungsi ini di user repository
exports.getAllUsers = async () => {
  // Ganti fungsi ini untuk menampilkan semua kolom termasuk password
  const result = await pool.query('SELECT id, name, email, password, balance, created_at FROM users');
  return result.rows;
};

// Di file user.repository.js, pastikan fungsi registerUser menerima parameter username, bukan name
registerUser: async (username, email, password) => {
    // Implementasi penyimpanan user
}

