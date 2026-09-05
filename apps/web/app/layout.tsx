import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ToastContainer } from '../components/ui/ToastContainer';
import { PwaInstallPrompt } from '../components/pwa/PwaInstallPrompt';
import { GlobalMaintenanceListener } from '../components/common/GlobalMaintenanceListener';

export const metadata: Metadata = {
  title: 'NabungID — Platform Tabungan Hari Raya & Paket Lebaran 1 Tahun Penuh',
  description:
    'Nabung 100rb per minggu mulai dari H+1 Idul Fitri hingga H-1 Idul Fitri. Dapatkan uang tunai bersih dan paket sembako daging sapi segar, telur, minyak goreng, dan kue kaleng tanpa was-was.',
  keywords: [
    'tabungan lebaran',
    'paket sembako idul fitri',
    'nabung idul fitri',
    'kue kaleng lebaran',
    'hampers hari raya',
    'tabungan mingguan',
  ],
  authors: [{ name: 'NabungID Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#070b12',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className="bg-[#070b12] text-slate-100 min-h-screen flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
        <GlobalMaintenanceListener />
        {children}
        <ToastContainer />
        <PwaInstallPrompt />
      </body>
    </html>
  );
}

