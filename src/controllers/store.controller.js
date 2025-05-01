const storeRepository = require('../repositories/store.repository');
const baseResponse = require('../Utils/baseResponse.util');

// GET ALL STORES
exports.getAllStores = async (req, res) => {
  try {
    const stores = await storeRepository.getAllStores();
    return baseResponse(res, true, 200, 'Stores retrieved successfully', stores);
  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, 'Failed to retrieve stores');
  }
};

// CREATE STORE
exports.createStore = async (req, res) => {
  const { name, address } = req.body;
  if (!name || !address) return baseResponse(res, false, 400, 'Missing store name or address');

  try {
    const store = await storeRepository.createStore(name, address);
    return baseResponse(res, true, 201, 'Store created successfully', store);
  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, 'Failed to create store');
  }
};

// GET STORE BY ID
exports.getStoreById = async (req, res) => {
  const { id } = req.params;
  try {
    const store = await storeRepository.getStoreById(id);
    if (!store) return baseResponse(res, false, 404, 'Store not found');
    return baseResponse(res, true, 200, 'Store found', store);
  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, 'Failed to retrieve store');
  }
};

// UPDATE STORE
exports.updateStore = async (req, res) => {
  const { id, name, address } = req.body;
  if (!id || !name || !address) return baseResponse(res, false, 400, 'Missing fields');

  try {
    const updatedStore = await storeRepository.updateStore(id, name, address);
    if (!updatedStore) return baseResponse(res, false, 404, 'Store not found');
    return baseResponse(res, true, 200, 'Store updated successfully', updatedStore);
  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, 'Failed to update store');
  }
};

// DELETE STORE
exports.deleteStore = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStore = await storeRepository.deleteStore(id);
    if (!deletedStore) return baseResponse(res, false, 404, 'Store not found');
    return baseResponse(res, true, 200, 'Store deleted successfully', deletedStore);
  } catch (error) {
    console.error(error);
    return baseResponse(res, false, 500, 'Failed to delete store');
  }
};
