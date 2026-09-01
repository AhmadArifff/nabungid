const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const BASE_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.resolve(__dirname, '../docs/screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function captureAll() {
  console.log('🚀 Launching Chromium for automated screenshot capture...');
  const browser = await chromium.launch({ headless: true });
  
  // 1. Desktop Context
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2,
  });

  const page = await context.newPage();

  try {
    // 1. Landing Page Hero
    console.log('📸 Capturing 01_landing_hero.png...');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForSelector('h1', { state: 'visible', timeout: 30000 });
    await page.waitForTimeout(4000); // allow 3D canvas, Framer motion, and background glow to settle
    await page.screenshot({ path: path.join(OUTPUT_DIR, '01_landing_hero.png') });

    // 2. Interactive Calculator Section
    console.log('📸 Capturing 02_calculator.png...');
    const calculatorEl = page.locator('#kalkulator');
    if (await calculatorEl.count() > 0) {
      await calculatorEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(2000);
      await calculatorEl.screenshot({ path: path.join(OUTPUT_DIR, '02_calculator.png') });
    } else {
      await page.screenshot({ path: path.join(OUTPUT_DIR, '02_calculator.png') });
    }

    // 3. Parcel Builder Section
    console.log('📸 Capturing 03_parcel_builder.png...');
    const parcelEl = page.locator('#parcel-builder');
    if (await parcelEl.count() > 0) {
      await parcelEl.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await parcelEl.screenshot({ path: path.join(OUTPUT_DIR, '03_parcel_builder.png') });
    }

    // 4. Nasabah Dashboard
    console.log('📸 Capturing 04_nasabah_dashboard.png...');
    await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '04_nasabah_dashboard.png') });

    // 5. Kartu Absensi 50 Minggu
    console.log('📸 Capturing 05_kartu_absensi_50minggu.png...');
    await page.goto(`${BASE_URL}/tabunganku`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '05_kartu_absensi_50minggu.png') });

    // 6. Katalog Paket
    console.log('📸 Capturing 06_katalog_paket.png...');
    await page.goto(`${BASE_URL}/paket`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '06_katalog_paket.png') });

    // 7. Penarikan Darurat
    console.log('📸 Capturing 07_penarikan_darurat.png...');
    await page.goto(`${BASE_URL}/penarikan`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '07_penarikan_darurat.png') });

    // 8. Admin Dashboard
    console.log('📸 Capturing 08_admin_dashboard.png...');
    // Set admin auth in localStorage
    await page.evaluate(() => {
      localStorage.setItem(
        'nabungid-auth-storage',
        JSON.stringify({
          state: {
            user: {
              id: 'usr-admin-01',
              name: 'Admin Pengelola',
              email: 'admin@nabungid.com',
              phoneNumber: '089988776655',
              role: 'ADMIN',
            },
            isAuthenticated: true,
            role: 'ADMIN',
          },
          version: 0,
        })
      );
    });
    await page.goto(`${BASE_URL}/admin/dashboard`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '08_admin_dashboard.png') });

    // 9. Admin Verifikasi Setoran
    console.log('📸 Capturing 09_admin_verifikasi.png...');
    await page.goto(`${BASE_URL}/admin/verifikasi`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '09_admin_verifikasi.png') });

    // 10. Admin Manifest Pembagian
    console.log('📸 Capturing 10_admin_distribusi.png...');
    await page.goto(`${BASE_URL}/admin/distribusi`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '10_admin_distribusi.png') });

    // 11. Mobile Responsive View
    console.log('📸 Capturing 11_mobile_pwa.png...');
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/tabunganku`, { waitUntil: 'domcontentloaded', timeout: 45000 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(OUTPUT_DIR, '11_mobile_pwa.png') });

    console.log('🎉 All 11 screenshots successfully captured and saved to docs/screenshots/');
  } catch (error) {
    console.error('❌ Error capturing screenshots:', error);
  } finally {
    await browser.close();
  }
}

captureAll();
