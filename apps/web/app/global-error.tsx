'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#070b12',
          color: '#f8fafc',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div
          style={{
            maxWidth: '420px',
            width: '90%',
            padding: '32px',
            backgroundColor: '#0f172a',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '24px',
            textAlign: 'center',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              margin: '0 auto 16px auto',
              borderRadius: '16px',
              backgroundColor: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fb7185',
              fontSize: '24px',
            }}
          >
            ⚠️
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>
            Aplikasi Mengalami Kendala
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5', marginBottom: '24px' }}>
            Terjadi masalah tak terduga pada halaman utama NabungID. Silakan coba muat ulang.
          </p>

          <button
            onClick={() => reset()}
            style={{
              width: '100%',
              padding: '12px 20px',
              backgroundColor: '#059669',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Muat Ulang Aplikasi
          </button>
        </div>
      </body>
    </html>
  );
}
