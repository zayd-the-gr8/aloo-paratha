const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const Scramjet = require('@titaniumnetwork-dev/scramjet'); 

const app = express();
const server = createServer(app);

// Enable CORS so your frontend hosted on GitHub can communicate with Railway
app.use(cors({
    origin: process.env.FRONTEND_URL || '*', 
    credentials: true
}));

// Initialize Scramjet middleware
const proxy = new Scramjet({
    prefix: '/service/',
    config: {
        codec: 'xor', // Obfuscates traffic to bypass strict network filters
    }
});

app.use(proxy.express());

// Fallback route for diagnostic checking
app.get('/health', (req, res) => res.status(200).json({ status: 'Proxy active' }));

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`🚀 Scramjet Engine deployed on port ${PORT}`);
});
