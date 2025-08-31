// backend/NodeJS/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const { sequelize } = require('./src/config/db');
require('./src/models'); // initializes models and associations
const setupSwagger = require('./src/swagger');

const app = express();
app.use(express.json());
// CORS configuration
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:3000',
  'http://localhost:4000',
  'http://localhost:5173', // Vite default port
  'http://127.0.0.1:8080',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:4000',
  'http://127.0.0.1:5173', // Vite default port
  'http://localhost:8081',
  'http://127.0.0.1:8081',
  'http://localhost:8000',  // Common alternative port
  'http://127.0.0.1:8000'   // Common alternative port
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
}));
app.use('/uploads', express.static(require('path').join(process.cwd(), 'uploads')));

// Swagger docs
setupSwagger(app);

app.get('/', (req, res) => {
  res.json({
    name: 'HireHub API',
    status: 'ok',
    endpoints: ['/health', '/auth/*', '/users/*', '/employers/*'],
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/auth', require('./src/routes/auth'));
app.use('/users', require('./src/routes/users'));
app.use('/employers', require('./src/routes/employers'));

async function start() {
  try {
    await sequelize.authenticate();
    // Note: for production use migrations; alter is fine for early development
    await sequelize.sync({ alter: true });

    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`API running on http://localhost:${port}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = { app, start };