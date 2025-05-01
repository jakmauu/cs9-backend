const pool = require('../database/pg.database');


// CREATE
exports.createItem = async (name, price, store_id, image_url, stock) => {
  const result = await pool.query(
    'INSERT INTO items (name, price, store_id, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [name, price, store_id, image_url, stock]
  );
  return result.rows[0];
};


// GET ALL
exports.getAllItems = async () => {
  const result = await pool.query('SELECT * FROM items');
  return result.rows;
};

// GET BY ID
exports.getItemById = async (id) => {
  const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
  return result.rows[0];
};

// GET BY STORE ID
exports.getItemsByStoreId = async (store_id) => {
  const result = await pool.query('SELECT * FROM items WHERE store_id = $1', [store_id]);
  return result.rows;
};

exports.updateItem = async (id, name, price, store_id, image_url, stock) => {
  let query = 'UPDATE items SET name = $1, price = $2, store_id = $3, stock = $4';
  const values = [name, price, store_id, stock];
  let idx = 5;

  if (image_url) {
    query += `, image_url = $${idx}`;
    values.push(image_url);
    idx++;
  }

  query += ` WHERE id = $${idx} RETURNING *`;
  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0];
};

exports.deleteItem = async (id) => {
  const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

// Update stok item
exports.updateItemStock = async (id, newStock) => {
  const result = await pool.query(
    'UPDATE items SET stock = $1 WHERE id = $2 RETURNING *',
    [newStock, id]
  );
  return result.rows[0];
};
