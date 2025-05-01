const pool = require('../database/pg.database');

// CREATE TRANSACTION
exports.createTransaction = async (user_id, item_id, quantity, total, status = 'pending') => {
    const result = await pool.query(
        'INSERT INTO transactions (user_id, item_id, quantity, total, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [user_id, item_id, quantity, total, status]
    );
    return result.rows[0];
};



// PAY TRANSACTION
exports.payTransaction = async (id) => {
    const result = await pool.query(
        'UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *',
        ['paid', id]
    );
    return result.rows[0];
};

// DELETE TRANSACTION
exports.deleteTransaction = async (id) => {
    const result = await pool.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

exports.getAllTransactions = async () => {
    const result = await pool.query('SELECT * FROM transactions');
    return result.rows;
};

// Ambil transaksi berdasarkan user_id
exports.getTransactionsByUserId = async (userId) => {
    const result = await pool.query('SELECT * FROM transactions WHERE user_id = $1', [userId]);
    return result.rows;
};