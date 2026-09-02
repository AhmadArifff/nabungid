let app: any;
let initError: any = null;

try {
  // Import Express app secara dinamis untuk menangkap error top-level saat inisialisasi
  app = require('../src/app').default;
} catch (err: any) {
  console.error('Fatal Top-Level Initialization Error:', err);
  initError = err;
}

export default function handler(req: any, res: any) {
  if (initError) {
    return res.status(500).json({
      success: false,
      error: 'Serverless Function Initialization Error',
      message: initError.message,
      stack: initError.stack,
    });
  }
  
  if (typeof app !== 'function') {
    return res.status(500).json({
      success: false,
      error: 'App Configuration Error',
      message: 'Express app is not a function',
    });
  }

  // Lanjutkan request ke Express
  return app(req, res);
}
