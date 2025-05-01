const multer = require('multer');
const storage = multer.memoryStorage(); // Simpan di memori untuk langsung dikirim ke Cloudinary
const upload = multer({ storage: storage });

module.exports = upload;
