require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Lazada Callback Endpoint
app.post('/lazada/callback', async (req, res) => {
    try {
        const { code } = req.query;

        if (!code) {
            return res.status(400).json({ message: 'Authorization code missing' });
        }

        const tokenUrl = 'https://auth.lazada.com/rest/oauth2/token';
        const response = await axios.post(tokenUrl, null, {
            params: {
                grant_type: 'authorization_code',
                code: code,
                client_id: process.env.APP_KEY,
                client_secret: process.env.APP_SECRET,
            },
        });

        const { access_token, refresh_token, expires_in } = response.data;

        console.log('Access Token:', access_token);

        // Kirim respon sukses ke Lazada
        return res.status(200).json({
            message: 'Callback processed successfully',
            data: {
                access_token,
                refresh_token,
                expires_in,
            },
        });
    } catch (error) {
        console.error('Error processing callback:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Default Route
app.get('/', (req, res) => {
    res.send('Lazada Callback Service is running!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
