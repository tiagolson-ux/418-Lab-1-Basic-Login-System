require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Note to self: Tia, middleware to parse JSON
app.use(express.json());

const userRoutes = require('./routes/users');

// Note to self: Tia, use the user routes
app.use('/api/users', userRoutes);

// Note to self: Tia, connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 3000;

// Note to self: Tia, start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));