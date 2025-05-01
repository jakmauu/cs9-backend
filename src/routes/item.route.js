const express = require('express');
const router = express.Router();
const multer = require('multer');
const itemController = require('../controllers/item.controller');

// Konfigurasi multer (bisa pake memory storage untuk langsung upload ke cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route untuk create item (upload gambar)
router.post('/create', upload.single('image'), itemController.createItem);

// Tambahkan route baru untuk membuat item tanpa upload

// Route untuk create item tanpa upload gambar (JSON)
router.post('/create-no-upload', itemController.createItemNoUpload);

module.exports = router;

// GET ALL ITEMS
router.get('/', itemController.getAllItems);

// GET ITEM BY ID
router.get('/byId/:id', itemController.getItemById);

// GET ITEM BY STORE ID
router.get('/byStoreId/:store_id', itemController.getItemsByStoreId);

// Update Item (Body Form-data + image)
router.put('/', upload.single('image'), itemController.updateItem);

// Update Stok Item
router.put('/updateStock', itemController.updateItemStock);

// Delete Item by ID
router.delete('/:id', itemController.deleteItem);