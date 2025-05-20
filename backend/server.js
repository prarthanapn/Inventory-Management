require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');



const app = express();

const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send(' Inventory Management API is running');
});

// Routes
app.use('/products', productRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error(' MongoDB connection error:', err);
  })
