import React from 'react';
import { Bus, Phone, MapPin, MessageSquare } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/initialBusData';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-300 text-xs py-10 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
        {/* Brand Information */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-md shadow-amber-950/40">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black text-white tracking-wider font-serif">
                {COMPANY_DETAILS.name}
              </span>
              <p className="text-[11px] text-amber-400 font-medium tracking-wide">{COMPANY_DETAILS.tagline}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            Premium luxury passenger bus fleet based in Madurai. Featuring our signature transparent
            3D luxury coach, guaranteed seat allocation, and verified passenger model seating.
          </p>
        </div>

        {/* Operating Routes */}
        <div>
          <h4 className="text-white font-bold text-sm mb-2.5">Operating Routes</h4>
          <ul className="space-y-1.5 text-slate-400 text-xs">
            <li>• Madurai ⇄ Chennai (Luxury AC Multi-Axle)</li>
            <li>• Madurai ⇄ Bengaluru (Overnight Express)</li>
            <li>• Madurai ⇄ Coimbatore (Semi-Sleeper Service)</li>
            <li>• Madurai ⇄ Trichy & Salem</li>
          </ul>
        </div>

        {/* Mandated Official Contact Details */}
        <div className="space-y-2 text-xs">
          <h4 className="text-white font-bold text-sm mb-2.5">Official Contact Details</h4>
          <div className="flex items-start gap-2.5 text-slate-300">
            <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-serif">{COMPANY_DETAILS.name}</strong>
              <span>South Veli Street,</span>
              <br />
              <span>Madurai - 1, Tamil Nadu, India.</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-slate-300">
            <Phone className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Phone: <strong className="text-white">{COMPANY_DETAILS.phone}</strong></span>
          </div>

          <div className="flex items-center gap-2.5 text-slate-300">
            <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>WhatsApp: <strong className="text-emerald-400">{COMPANY_DETAILS.whatsapp}</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-300 text-[11px]">
        <div>
          © {new Date().getFullYear()} {COMPANY_DETAILS.name}. All Rights Reserved. South Veli Street, Madurai - 1.
        </div>
        <div className="flex items-center gap-3">
          <span>Official 3D Bus Platform</span>
          <span>•</span>
          <span>Real-time Seat Persistence</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
