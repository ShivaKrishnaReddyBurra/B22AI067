const express = require('express');
const { Log } = require('../../LoggingMiddleware/src/index'); // Adjust path as needed
const cors = require('cors');
const app = express();
const PORT = 5000;
const BASE_URL = `http://localhost:${PORT}`;

const shortUrls = new Map();

// Enable CORS for localhost:3000 (must be before routes)
app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(express.json());

// Function to generate a unique random shortcode (6 alphanumeric chars)
function generateShortcode() {
    let code;
    do {
        code = Math.random().toString(36).substring(2, 8); // Alphanumeric, 6 chars
    } while (shortUrls.has(code));
    return code;
}

// Validate if a string is a valid URL
function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// Validate shortcode: alphanumeric, 4-10 chars
function isValidShortcode(code) {
    return /^[a-zA-Z0-9]{4,10}$/.test(code);
}

// POST /shorturls - Create shortened URL
app.post('/shorturls', async (req, res) => {
    const { url, validity, shortcode } = req.body;

    if (!url || !isValidUrl(url)) {
        await Log('backend', 'error', 'handler', `Invalid URL provided: ${url || 'missing'}`);
        return res.status(400).json({ error: 'Invalid or missing URL' });
    }

    let validMinutes = parseInt(validity, 10);
    if (isNaN(validMinutes) || validMinutes <= 0) {
        validMinutes = 30; // Default
    }

    let code = shortcode;
    if (code) {
        if (!isValidShortcode(code)) {
            await Log('backend', 'error', 'handler', `Invalid shortcode provided: ${code}`);
            return res.status(400).json({ error: 'Invalid shortcode: Must be alphanumeric, 4-10 characters' });
        }
        if (shortUrls.has(code)) {
            await Log('backend', 'error', 'handler', `Shortcode collision: ${code} already in use`);
            return res.status(409).json({ error: 'Shortcode already in use' });
        }
    } else {
        code = generateShortcode();
    }

    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + validMinutes);

    shortUrls.set(code, { originalUrl: url, expiry: expiryDate });

    await Log('backend', 'info', 'service', `Short URL created: ${code} for ${url}, expires at ${expiryDate.toISOString()}`);

    res.status(201).json({
        shortLink: `${BASE_URL}/shorturls/${code}`,
        expiry: expiryDate.toISOString()
    });
});

// GET /shorturls/:shortcode - Redirect to original URL
app.get('/shorturls/:shortcode', async (req, res) => {
    const code = req.params.shortcode;
    const entry = shortUrls.get(code);

    if (!entry) {
        try {
            await Log('backend', 'warn', 'handler', `Non-existent shortcode accessed: ${code}`);
        } catch (logError) {
            console.error('Logging failed:', logError.message); // Fallback
        }
        return res.status(404).json({ error: 'Shortcode not found' });
    }

    if (new Date() > entry.expiry) {
        shortUrls.delete(code); // Clean up expired
        try {
            await Log('backend', 'warn', 'handler', `Expired shortcode accessed: ${code}`);
        } catch (logError) {
            console.error('Logging failed:', logError.message); // Fallback
        }
        return res.status(410).json({ error: 'Short link has expired' });
    }

    try {
        await Log('backend', 'info', 'service', `Redirecting shortcode: ${code} to ${entry.originalUrl}`);
    } catch (logError) {
        console.error('Logging failed:', logError.message); // Fallback
    }

    // Ensure the originalUrl is valid before redirecting
    if (!isValidUrl(entry.originalUrl)) {
        return res.status(400).json({ error: 'Invalid original URL stored' });
    }

    res.redirect(301, entry.originalUrl);
});

// Global error handler
app.use((err, req, res, next) => {
    Log('backend', 'fatal', 'handler', `Unexpected error: ${err.message}`).catch((logError) => {
        console.error('Logging failed:', logError.message); // Fallback
    });
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
    console.log(`Server running on ${BASE_URL}`);
});