require('dotenv').config(); // Panggil dotenv sekali di awal
const express = require('express');
const corsMiddleware = require('./src/middlewares/cors.middleware'); // Middleware CORS terpisah

const app = express();
const port = process.env.PORT || 3000;

const userRoute = require('./src/routes/user.route');
const storeRoute = require('./src/routes/store.route'); // Jika ada
const itemRoute = require('./src/routes/item.route');
const transactionRoute = require('./src/routes/transaction.route');

// Middleware
app.use(express.json()); // Gunakan middleware JSON untuk parsing request body
app.use(corsMiddleware); // Gunakan middleware CORS

// Health check (opsional)
app.get('/health', (req, res) => {
    res.json({ success: true, message: 'API running properly' });
});

// Root route
app.get('/', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API running properly', 
        availableRoutes: {
            health: '/health',
            users: '/user',
            stores: '/store',
            items: '/item',
            transactions: '/transaction'
        }
    });
});

// Routes
app.use('/user', userRoute);
app.use('/store', storeRoute); // Jika ada
app.use('/item', itemRoute);

// Jalankan server
app.listen(port, () => console.log(`Server running on port ${port}`));

app.use('/transaction', transactionRoute);