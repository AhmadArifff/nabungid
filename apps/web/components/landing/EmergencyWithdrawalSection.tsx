'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Percent, Lock, Coins, CheckCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { TiltCard } from '../ui/TiltCard';

export const EmergencyWithdrawalSection: React.FC = () => {
  const rules = [
    {
      icon: Percent,
      title: 'Bebas Denda (0% Potongan Penalti)',
      desc: 'Penarikan darurat tidak dikenakan potongan biaya penalti atau komisi bunga sama sekali.',
      color: 'text-emerald-400',
    },
    {
      icon: Coins,
      title: 'Batas Maksimal Rp 500.000',
      desc: 'Menjamin sebagian besar tabungan Anda tetap utuh untuk kebutuhan Hari Raya Idul Fitri.',
      color: 'text-amber-400',
    },
    {
      icon: Lock,
      title: 'Maksimal 1x Penarikan',
      desc: 'Dapat dicairkan 1 kali selama 1 siklus tahun berjalan jika Anda menghadapi keperluan mendesak.',
      color: 'text-blue-400',
    },
    {
      icon: ShieldCheck,
      title: 'Validasi Saldo Aman',
      desc: 'Saldo tabungan berjalan Anda cukup dan telah diverifikasi oleh sistem serta admin.',
      color: 'text-purple-400',
    },
  ];

  return (
    <section id="tarik-darurat" className="py-24 relative overflow-hidden bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Shield Visual */}
          <div className="lg:col-span-5">
            <TiltCard glowColor="rgba(16, 185, 129, 0.3)" className="glass-panel-glow p-8 rounded-3xl border border-emerald-500/30 text-center space-y-6">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-amber-400 p-0.5 shadow-xl shadow-emerald-950/60 flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
                  <ShieldCheck className="w-10 h-10 text-emerald-400" />
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs uppercase tracking-widest font-mono text-emerald-400 font-bold">
                  Fitur Emergency Protection
                </span>
                <h3 className="text-2xl font-extrabold text-white">Dana Darurat Siap Pakai</h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Ada kebutuhan berobat atau perbaikan motor mendadak di tengah tahun? Tenang, Anda punya hak tarik darurat!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 text-left space-y-2">
                <div className="text-xs text-slate-400 font-medium">Batas Plafon Darurat:</div>
                <div className="text-3xl font-extrabold font-mono text-amber-400">Rp 500.000</div>
                <div className="text-[11px] text-emerald-300 flex items-center">
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Maksimal 1x penarikan • Tanpa potongan penalti
                </div>
              </div>
            </TiltCard>
          </div>

          {/* Right Column: Key Rules */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Fleksibilitas Tanpa Khawatir</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Tabungan Terkunci Tapi <span className="text-gradient-emerald">Tetap Ramah Kebutuhan Darurat</span>
              </h2>
              <p className="text-slate-300 text-sm sm:text-base">
                Banyak orang ragu menabung 1 tahun karena takut uang terkunci saat ada musibah mendadak. NabungID memberi
                solusi adil dengan sistem penarikan darurat terukur.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {rules.map((rule, idx) => {
                const Icon = rule.icon;
                return (
                  <div
                    key={idx}
                    className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2 hover:border-white/15 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-slate-900 border border-white/10">
                        <Icon className={`w-5 h-5 ${rule.color}`} />
                      </div>
                      <h4 className="font-bold text-sm text-white">{rule.title}</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{rule.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
