const express = require('express');
const path = require('path');
const carRoutes = require('./routes/carRoutes');

const app = express();

// Cấu hình view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', carRoutes);

module.exports = app;