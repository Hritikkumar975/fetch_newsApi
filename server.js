// server.js

require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

// Middleware to serve static files from the 'public' directory
app.use(express.static(_dirname));

// API route to fetch news from NewsAPI
app.get('/api/news', async (req, res) => {
  const apiKey = '4f375dc10068498c9e40bfadfde39795';
  const url = 'https://newsapi.org/v2/top-headlines';

  try {
    const response = await axios.get(url, {
      params: {
        country: 'us', // India
        apiKey: apiKey,
        pageSize: 20, // Number of articles to fetch
      },
    });

    res.json(response.data.articles); // Send articles as JSON to the frontend
  } catch (error) {
    console.error('Error fetching news:', error.message);

    // Handle specific error scenarios
    if (error.response) {
      // The request was made, and the server responded with a status code outside of the 2xx range
      res.status(error.response.status).json({
        message: error.response.data.message || 'Failed to fetch news articles.',
      });
    } else if (error.request) {
      // The request was made, but no response was received
      res.status(500).json({ message: 'No response received from NewsAPI.' });
    } else {
      // Something else happened while setting up the request
      res.status(500).json({ message: 'An unexpected error occurred.' });
    }
  }
});

// Optional: Fallback route for handling undefined routes (useful for Single Page Applications)
// Uncomment the following lines if needed
/*
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
*/

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

