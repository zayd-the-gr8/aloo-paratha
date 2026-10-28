const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const Scramjet = require('@titaniumnetwork-dev/scramjet'); 

const app = express();
const server = createServer(app);

// Relax CORS restrictions to let your GitHub Pages UI query the proxy safely
app.use(cors({
    origin: '*', 
    credentials: true
}));

// Initialize the proxy core middleware routing configurations
const proxy = new Scramjet({
    prefix: '/service/',
    config: {
        codec: 'xor' // Encodes destination endpoints to bypass perimeter network blocks
    }
});

app.use(proxy.express());

// Simple live health ping route
app.get('/proxy-status', (req, res) => res.status(200).json({ active: true, engine: 'Scramjet' }));

// Bonto automatically maps the listening container port dynamically via process.env.PORT
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Proxy engine live and listening on port ${PORT}`);
});
