const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// GET ALL USERS
router.get('/', userController.getAllUsers);

// REGISTER USER
router.post('/register', userController.registerUser);

// LOGIN USER 
router.post('/login', userController.loginUser);

// GET USER BY EMAIL
router.get('/:email', userController.getUserByEmail);

// UPDATE USER (dengan body JSON)
router.put('/', userController.updateUser);

// DELETE USER BY ID
router.delete('/:id', userController.deleteUser);

// TOP UP USER BALANCE
router.post('/topUp', userController.topUpUser);

// Tambahkan route ini:
router.post('/directLogin', userController.directLogin);

// Tambahkan route baru:

// Update Balance User
router.post('/updateBalance', userController.updateBalance);

module.exports = router;
