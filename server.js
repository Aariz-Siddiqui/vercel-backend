// server.js
require('dotenv').config();
const express = require('express');
const app = express();
const authRouter = require('./router/auth-router');
const authContact = require("./router/contact-router");
const authService = require("./router/service-router");
const adminRouter = require("./router/admin-router");
const connectdb = require('./utils/db');
const errorMiddleware = require("./middlewares/error-middleware");
const cors = require("cors");

// ---------- CORS config ----------
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const allowedOrigins = [
  FRONTEND_URL,
  'http://localhost:5173',
  'https://vercel-frontend-five-bay.vercel.app' // your frontend
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow curl/postman
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('CORS policy: origin not allowed'), false);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With','Accept'],
  credentials: true,
  maxAge: 600
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // preflight

app.use(express.json());

// optional request logger to help debugging
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl, 'Origin:', req.headers.origin || '—');
  next();
});

// routes
app.get("/", (req, res) => res.status(200).send("Welcome from the backend"));

app.use("/api/auth", authRouter);
app.use("/api", authContact);
app.use("/data", authService);
app.use("/api/admin", adminRouter);

app.use(errorMiddleware);

// start
const PORT = process.env.PORT || 8000;
connectdb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('DB connect/start failed:', err);
    process.exit(1);
  });
