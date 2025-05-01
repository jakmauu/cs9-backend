const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');

// CREATE TRANSACTION (Body JSON)
router.post('/create', transactionController.createTransaction);

// PAY TRANSACTION (Params)
router.post('/pay/:id', transactionController.payTransaction);

// DELETE TRANSACTION (Params)
router.delete('/:id', transactionController.deleteTransaction);

//Tambahkan yang ini:
router.get('/', transactionController.getAllTransactions); // Semua transaksi
router.get('/user/:user_id', transactionController.getTransactionsByUser); // Transaksi user tertentu

module.exports = router;
