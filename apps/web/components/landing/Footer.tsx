'use client';

import React from 'react';
import { Sparkles, Shield, Heart, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90 relative z-10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
          {/* Col 1: Brand */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-400 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                Nabung<span className="text-amber-400">ID</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
              Platform modern manajemen tabungan berkala Idul Fitri 1 tahun penuh. Membantu keluarga dan komunitas
              merencanakan Hari Raya dengan tenang, panen uang tunai, dan paket sembako berkualitas.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <Shield className="w-4 h-4" />
              <span>Sistem Pencatatan Transparan & Database Aman</span>
            </div>
          </div>

          {/* Col 2: Navigasi */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider">Navigasi</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#kalkulator" className="hover:text-amber-400 transition-colors">Kalkulator Simulasi</a></li>
              <li><a href="#rakit-parcel" className="hover:text-amber-400 transition-colors">Katalog & Rakit Parcel</a></li>
              <li><a href="#timeline" className="hover:text-amber-400 transition-colors">Timeline 50 Minggu</a></li>
              <li><a href="#tarik-darurat" className="hover:text-amber-400 transition-colors">Kebijakan Tarik Darurat</a></li>
              <li><a href="#faq" className="hover:text-amber-400 transition-colors">Tanya Jawab (FAQ)</a></li>
            </ul>
          </div>

          {/* Col 3: Layanan Bantuan */}
          <div className="space-y-3">
            <h5 className="text-sm font-bold text-white uppercase tracking-wider">Pusat Bantuan</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp: +62 812-3456-7890</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Email: salam@nabungid.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <span>Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NabungID. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex items-center space-x-1">
            <span>Dibuat dengan penuh</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
            <span>untuk menyambut Hari Raya Idul Fitri.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
