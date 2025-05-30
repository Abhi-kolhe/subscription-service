require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');


const app = express();

// Middleware
app.use(express.json());

// Import routes
const planRoutes = require('./routes/planRoutes');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptions');
// Use routes
app.use('/plans', planRoutes);
app.use('/auth', authRoutes);
app.use('/subscriptions', subscriptionRoutes);
// Root endpoint

app.get('/', (req, res) => {
  res.send('Subscription Service API is running');
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
 