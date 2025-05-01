const transactionRepository = require('../repositories/transaction.repository');
const baseResponse = require('../Utils/baseResponse.util');

// CREATE TRANSACTION
exports.createTransaction = async (req, res) => {
    try {
        const { user_id, item_id, quantity } = req.body;

        if (!user_id || !item_id || !quantity || quantity <= 0) {
            return baseResponse(res, false, 400, 'Invalid transaction data', null);
        }

        // Get item to calculate total based on actual item price
        const itemRepository = require('../repositories/item.repository');
        const item = await itemRepository.getItemById(item_id);
        
        if (!item) {
            return baseResponse(res, false, 404, 'Item not found', null);
        }
        
        // Calculate total price
        const total = quantity * item.price;

        // Create the transaction
        const transaction = await transactionRepository.createTransaction(user_id, item_id, quantity, total);
        return baseResponse(res, true, 201, 'Transaction created', transaction);
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, 'Failed to create transaction', null);
    }
};

// PAY TRANSACTION
exports.payTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await transactionRepository.payTransaction(id);

        if (!transaction) {
            return baseResponse(res, false, 400, 'Failed to pay', null);
        }

        return baseResponse(res, true, 200, 'Payment successful', transaction);
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, 'Failed to process payment', null);
    }
};

// DELETE TRANSACTION
exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await transactionRepository.deleteTransaction(id);

        if (!transaction) {
            return baseResponse(res, false, 404, 'Transaction not found', null);
        }

        return baseResponse(res, true, 200, 'Transaction deleted', transaction);
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, 'Failed to delete transaction', null);
    }
};

// GET semua transaksi
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionRepository.getAllTransactions();
        return baseResponse(res, true, 200, 'All transactions retrieved', transactions);
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, 'Failed to retrieve transactions', null);
    }
};

// GET transaksi berdasarkan user_id
exports.getTransactionsByUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        const transactions = await transactionRepository.getTransactionsByUserId(user_id);
        if (transactions.length === 0) {
            return baseResponse(res, false, 404, 'No transactions found for this user', null);
        }

        return baseResponse(res, true, 200, 'User transactions retrieved', transactions);
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, 'Failed to retrieve user transactions', null);
    }
};
