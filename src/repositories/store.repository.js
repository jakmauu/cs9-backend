const pool = require('../database/pg.database');

// GET ALL
exports.getAllStores = async () => {
  const result = await pool.query('SELECT * FROM stores');
  return result.rows;
};

// GET BY ID
exports.getStoreById = async (id) => {
  const result = await pool.query('SELECT * FROM stores WHERE id = $1', [id]);
  return result.rows[0];
};

// CREATE
exports.createStore = async (name, address) => {
  const result = await pool.query('INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *', [name, address]);
  return result.rows[0];
};

// UPDATE
exports.updateStore = async (id, name, address) => {
  const result = await pool.query('UPDATE stores SET name = $1, address = $2 WHERE id = $3 RETURNING *', [name, address, id]);
  return result.rows[0];
};

// DELETE
exports.deleteStore = async (id) => {
  const result = await pool.query('DELETE FROM stores WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};
