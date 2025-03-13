const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const SearchResult = require('../src/models/SearchResult');

async function deduplicateSearchResults() {
  try {
    // Get all documents
    const allSearchResults = await SearchResult.find({});
    console.log(`Total documents before deduplication: ${allSearchResults.length}`);

    // Create a map to store unique queries
    const uniqueQueries = new Map();

    // Group documents by normalized query
    allSearchResults.forEach(doc => {
      const normalizedQuery = doc.query.toLowerCase().trim();
      
      if (!uniqueQueries.has(normalizedQuery) || 
          doc.lastRefreshed > uniqueQueries.get(normalizedQuery).lastRefreshed) {
        uniqueQueries.set(normalizedQuery, doc);
      }
    });

    // Delete all documents
    await SearchResult.deleteMany({});
    console.log('Deleted all existing documents');

    // Insert unique documents
    const uniqueDocs = Array.from(uniqueQueries.values());
    await SearchResult.insertMany(uniqueDocs);

    console.log(`Total documents after deduplication: ${uniqueDocs.length}`);
    console.log(`Removed ${allSearchResults.length - uniqueDocs.length} duplicate documents`);

    // Create unique index for future entries
    await SearchResult.collection.createIndex({ query: 1 }, { unique: true });
    console.log('Created unique index on query field');

  } catch (error) {
    console.error('Error during deduplication:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
deduplicateSearchResults();