import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import compression from 'compression';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(compression({
    filter: (req, res) => {
      // Prevent compressing heavy multimedia or 3D visual assets
      if (req.path.endsWith('.mp4') || req.path.endsWith('.glb') || req.path.endsWith('.jpg') || req.path.endsWith('.png')) {
        return false;
      }
      // Fallback to standard compression filter
      return compression.filter(req, res);
    }
  }));
  app.use(express.json());

  // Dedicated Health Check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development server middleware integrated');
  } else {
    // Serve static files in production with robust aggressive caching
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath, {
      maxAge: '1d', // Cache for 1 day by default
      etag: true,
      lastModified: true,
      setHeaders: (res, filePath, stat) => {
        // Cache immutable assets aggressively
        if (filePath.includes('/assets/') || filePath.endsWith('.mp4') || filePath.endsWith('.jpg') || filePath.endsWith('.png')) {
          res.set('Cache-Control', 'public, max-age=604800, immutable');
        } else if (filePath.endsWith('index.html')) {
          // NEVER cache the entry HTML
          res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
          res.set('Pragma', 'no-cache');
          res.set('Expires', '0');
        } else {
          res.set('Cache-Control', 'public, max-age=86400');
        }
      }
    }));
    
    // SPA Fallback: serve index.html for all other requests
    app.get('*', (req, res) => {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production static files from dist');
  }

  const server = app.listen(PORT, '0.0.0.0', () => {

    console.log(`Server listening on port ${PORT} (host: 0.0.0.0)`);
  });

  // Graceful shutdown handlers
  const shutdown = (signal: string) => {
    console.log(`${signal} signal received: closing HTTP server`);
    server.close(() => {
      console.log('HTTP server closed');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
