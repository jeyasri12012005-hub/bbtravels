import React from 'react';
import { COMPANY_DETAILS } from '../data/initialBusData';
import { Ticket, MessageSquare, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface HomePageProps {
  onNavigateToBooking: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigateToBooking }) => {
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${COMPANY_DETAILS.whatsappNumberDigits}&text=Hello%20BB%20Travels!%20I%20would%20like%20to%20inquire%20about%20ticket%20booking.`;

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Minimal Hero Header (Original Black & Gold) */}
      <div className="text-center pt-2 pb-6 max-w-3xl mx-auto">
        {/* Main Hero Heading */}
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-widest uppercase mb-2 font-serif">
          {COMPANY_DETAILS.name}
        </h1>

        {/* Brand Tagline */}
        <p className="text-base sm:text-lg font-medium text-amber-400 tracking-wide">
          "{COMPANY_DETAILS.tagline}"
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
          <button
            onClick={onNavigateToBooking}
            className="px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xl shadow-amber-950/50 transition flex items-center gap-2 group cursor-pointer tracking-wider"
          >
            <Ticket className="w-4 h-4" />
            <span>BOOK YOUR TICKET</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-950/50 transition flex items-center gap-2 cursor-pointer tracking-wider"
          >
            <MessageSquare className="w-4 h-4" />
            <span>CONTACT VIA WHATSAPP</span>
          </a>
        </div>
      </div>

      {/* Main Attraction: ONE Large, Visually Impressive Luxury Passenger Bus Photograph */}
      <div className="w-full flex-1 mb-8 max-w-6xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_50px_rgba(212,175,55,0.18)] bg-slate-950 group">
          {/* Subtle Golden Glow Accents */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Premium Coach Bus Photograph */}
          <div className="relative aspect-16/9 sm:aspect-21/9 w-full overflow-hidden bg-slate-900">
            <img
              src="/images/bb_travels_bus.jpg"
              alt="BB Travels Luxury Passenger Bus"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback to local asset if necessary
                const target = e.currentTarget;
                if (!target.src.includes('bb_travels_bus_1793948667171')) {
                  target.src = '/src/assets/images/bb_travels_bus_1793948667171.jpg';
                }
              }}
              className="w-full h-full object-cover object-center transform transition duration-700 group-hover:scale-102"
            />

            {/* Subtle Vignette & Gold Frame Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none"></div>

            {/* Floating Luxury Insignia */}
            <div className="absolute bottom-5 left-6 z-10 flex items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-amber-500/40 text-amber-400 font-serif font-black text-xs sm:text-sm tracking-widest flex items-center gap-2 shadow-xl">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>BB TRAVELS • LUXURY FLEET</span>
              </div>
              <div className="hidden sm:inline-block text-[11px] text-slate-300 font-mono bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700">
                Multi-Axle Air-Conditioned Sleeper & Semi-Sleeper
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Bottom Contact Strip */}
      <div className="text-center text-xs text-slate-400 pb-2 flex items-center justify-center gap-3 font-medium">
        <span>South Veli Street, Madurai</span>
        <span>•</span>
        <span>24x7 Helpline: +91 7598499066</span>
      </div>
    </div>
  );
};

export default HomePage;
