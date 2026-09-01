'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Star, MessageSquareQuote, CheckCircle2 } from 'lucide-react';
import { TiltCard } from '../ui/TiltCard';

const FAQS = [
  {
    q: 'Kapan program tabungan dimulai dan kapan pembagiannya?',
    a: 'Tabungan resmi dimulai pada H+1 minggu sehabis Hari Raya Idul Fitri (Minggu ke-1) dan berjalan selama 50 minggu. Seluruh uang sisa dan paket sembako dibagikan serentak pada H-1 minggu sebelum Idul Fitri tahun depan!',
  },
  {
    q: 'Bagaimana cara setor tabungan tiap minggunya?',
    a: 'Anda bisa mentransfer via Rekening Bank / QRIS dan mengunggah foto bukti transfer ke aplikasi PWA NabungID, atau menyetor tunai secara langsung ke Admin/Koordinator tabungan.',
  },
  {
    q: 'Apa saja isi paket sembako dan barang yang bisa dipilih?',
    a: 'Sangat fleksibel! Anda bisa memilih daging sapi segar 1kg, telur 1 tray, minyak goreng, beras pandan wangi, biskuit/kue kaleng Lebaran, hingga perabotan rumah tangga (wajan granit/toples kristal) sesuai selera.',
  },
  {
    q: 'Bagaimana jika saya butuh uang mendesak di tengah tahun?',
    a: 'NabungID menyediakan fitur Penarikan Darurat maksimal Rp 500.000 (1x penarikan) tanpa potongan penalti / 0% fee, asalkan saldo tabungan Anda telah mencukupi.',
  },
  {
    q: 'Bagaimana rumus pembagian akhir di H-1 Idul Fitri?',
    a: 'Rumus baku: Total Uang Diterima = Total Tabungan 50 Minggu - Biaya Admin (Rp 25.000) - Total Nilai Paket Barang yang Anda Pilih - Total Penarikan Darurat (jika ada).',
  },
];

const TESTIMONIALS = [
  {
    name: 'Ibu Ratna Sari',
    role: 'Nasabah Paket Berkah 100k',
    location: 'Bandung',
    text: 'Tahun lalu Lebaran sangat tenang! Tidak perlu pusing mikirin uang kue dan sembako karena sudah disiapkan lewat nabung 100rb seminggu. Pas H-1 dapet parcel daging + sisa uang 4 jutaan.',
    rating: 5,
  },
  {
    name: 'Bpk. Hendra Wijaya',
    role: 'Nasabah Paket 200k + Perabotan',
    location: 'Surabaya',
    text: 'Sangat transparan bisa cek mutasi mingguan lewat HP. Sempat ada keperluan mendesak anak sakit di bulan ke-5, alhamdulillah bisa tarik darurat 500rb tanpa dipotong komisi.',
    rating: 5,
  },
  {
    name: 'Ibu Siti Aminah',
    role: 'Nasabah Paket Sembako Premium',
    location: 'Bekasi',
    text: 'Suka banget bisa custom barang sembako daging sapi dan nastar wisman. Begitu H-1 Lebaran tinggal masak rendang tanpa repot desak-desakan belanja ke pasar!',
    rating: 5,
  },
];

export const TestimonialsAndFaq: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        {/* Testimonials Block */}
        <div>
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Cerita Sukses Nasabah</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Lebaran Lebih Bahagia & <span className="text-gradient-gold">Tanpa Beban Hutang</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((testi, idx) => (
              <TiltCard key={idx} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {[...Array(testi.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                    &ldquo;{testi.text}&rdquo;
                  </p>
                </div>
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <h5 className="text-sm font-bold text-white">{testi.name}</h5>
                    <span className="text-[11px] text-emerald-400 block">{testi.role}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{testi.location}</span>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>

        {/* FAQ Accordion Block */}
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Pertanyaan Umum</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Hal yang Sering Ditanyakan (FAQ)</h3>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="glass-panel rounded-2xl border border-white/10 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 text-left flex items-center justify-between space-x-4 hover:bg-white/5 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-semibold text-white">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-amber-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="p-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
