const cloudinary = require('../Utils/cloudinary');
const itemRepository = require('../repositories/item.repository');
const baseResponse = require('../Utils/baseResponse.util');
const stream = require('stream');

// Upload image helper
const uploadImage = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);

    bufferStream.pipe(
      cloudinary.uploader.upload_stream({ folder: 'items' }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
    );
  });
};

// CREATE ITEM
exports.createItem = async (req, res) => {
  try {
    const { name, price, store_id, stock } = req.body;
    const file = req.file;

    // Validasi field wajib
    if (!name || !price || !store_id || !stock || !file) {
      return baseResponse(res, false, 400, 'All fields are required', null);
    }

    // Upload gambar ke Cloudinary pakai helper function
    const uploadResult = await uploadImage(file.buffer);

    // Simpan ke database
    const item = await itemRepository.createItem(
      name,
      price,
      store_id,
      uploadResult.secure_url, // URL gambar dari cloudinary
      stock
    );

    return baseResponse(res, true, 201, 'Item created', item);

  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, 'Failed to create item', null);
  }
};

// Tambahkan fungsi baru: createItemNoUpload

// CREATE ITEM TANPA UPLOAD (JSON)
exports.createItemNoUpload = async (req, res) => {
  try {
    const { name, price, store_id, image_url, stock } = req.body;

    // Validasi field wajib
    if (!name || !price || !store_id || !image_url || !stock) {
      return baseResponse(res, false, 400, 'All fields are required', null);
    }

    // Simpan ke database (langsung gunakan URL gambar yang diberikan)
    const item = await itemRepository.createItem(
      name,
      price,
      store_id,
      image_url,
      stock
    );

    return baseResponse(res, true, 201, 'Item created', item);

  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, 'Failed to create item', null);
  }
};

// GET ALL ITEMS
exports.getAllItems = async (req, res) => {
  try {
    const items = await itemRepository.getAllItems();
    return baseResponse(res, true, 200, 'Items found', items);
  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, 'Failed to fetch items', null);
  }
};

// GET ITEM BY ID
exports.getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await itemRepository.getItemById(id);
    if (!item) return baseResponse(res, false, 404, 'Item not found', null);
    return baseResponse(res, true, 200, 'Item found', item);
  } catch (error) {
    console.error(error); // biar kelihatan di console errornya apa
    return baseResponse(res, false, 500, 'Failed to fetch item', null);
  }
};

// GET ITEMS BY STORE ID
exports.getItemsByStoreId = async (req, res) => {
  const { store_id } = req.params;
  try {
    const items = await itemRepository.getItemsByStoreId(store_id);
    if (!items || items.length === 0) {
      return baseResponse(res, false, 404, 'Store doesn\'t have items', null);
    }
    return baseResponse(res, true, 200, 'Items found', items);
  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, 'Failed to fetch items', null);
  }
};


exports.updateItem = async (req, res) => {
  try {
    const { id, name, price, store_id, stock } = req.body;
    const file = req.file;

    if (!id || !name || !price || !store_id || !stock) {
      return baseResponse(res, false, 400, 'All fields are required', null);
    }

    // Upload gambar ke Cloudinary jika ada
    let imageUrl = null;
    if (file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
        stream.end(file.buffer);
      });
      imageUrl = uploadResult.secure_url;
    }

    const updatedItem = await itemRepository.updateItem(id, name, price, store_id, imageUrl, stock);
    return baseResponse(res, true, 200, 'Item updated', updatedItem);

  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, 'Failed to update item', null);
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await itemRepository.deleteItem(id);
    if (!deletedItem) return baseResponse(res, false, 404, 'Item not found', null);
    return baseResponse(res, true, 200, 'Item deleted', deletedItem);
  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, 'Failed to delete item', null);
  }
};

// Update stok item setelah transaksi
exports.updateItemStock = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    
    // Ensure required data is available
    if (!id || !quantity) {
      return baseResponse(res, false, 400, 'Item ID and quantity are required', null);
    }
    
    // Get item first to check current stock
    const item = await itemRepository.getItemById(id);
    if (!item) {
      return baseResponse(res, false, 404, 'Item not found', null);
    }
    
    // Check if stock is sufficient
    if (item.stock < quantity) {
      return baseResponse(res, false, 400, 'Insufficient stock', null);
    }
    
    // Update stock (subtract quantity from current stock)
    const newStock = item.stock - quantity;
    const updatedItem = await itemRepository.updateItemStock(id, newStock);
    
    return baseResponse(res, true, 200, 'Item stock updated successfully', updatedItem);
  } catch (error) {
    console.error('Error updating item stock:', error);
    return baseResponse(res, false, 500, 'Failed to update item stock', null);
  }
};
