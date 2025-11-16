// server.js — CORS section (replace your current corsOptions)
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const allowedExplicit = [
  FRONTEND_URL,
  'http://localhost:5173',
  'https://vercel-frontend-five-bay.vercel.app',
  'https://vercel-frontend-1qyt3691y-aariz-siddiquis-projects.vercel.app' // add this exact origin
];

// allow any vercel.app preview subdomain automatically
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow curl/postman/no-origin
    try {
      const url = new URL(origin);
      // allow exact explicit origins OR any subdomain of vercel.app
      if (allowedExplicit.includes(origin) || url.hostname.endsWith('.vercel.app')) {
        return callback(null, true);
      }
    } catch (e) {
      // invalid origin, fall through to deny
    }
    return callback(new Error('CORS policy: origin not allowed'), false);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type','Authorization','X-Requested-With','Accept'],
  credentials: true,
  maxAge: 600
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
