const cors = require('cors');

const corsMiddleware = cors({
    origin: '*', // Izinkan semua origin. Ubah sesuai kebutuhan
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Metode yang diizinkan
    allowedHeaders: ['Content-Type', 'Authorization'], // Header yang diizinkan
});

module.exports = corsMiddleware;
