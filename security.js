// authMiddleware.js
require('dotenv').config();

async function checkHeaderAuth (req, res, next) {
    const headerKey = 'x-api-key'; // Customize this header name as needed
    const clientKey = req.headers[headerKey] || req.query.API_KEY;
    const serverKey = process.env.API_KEY;

    if (clientKey && clientKey === serverKey) {
        return next(); // Authorized
    }
    return res.status(403).json({ message: 'Forbidden: Invalid or missing API key' });
};

module.exports = {
    checkHeaderAuth
}; 
