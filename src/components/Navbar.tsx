import React from 'react';
import { Bus, MessageSquare, Ticket, Image as ImageIcon, Home, Phone } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/initialBusData';

interface NavbarProps {
  activeTab: 'home' | 'booking' | 'gallery';
  onNavigate: (tab: 'home' | 'booking' | 'gallery') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onNavigate }) => {
  const whatsappUrl = `https://api.whatsapp.com/send?phone=${COMPANY_DETAILS.whatsappNumberDigits}&text=Hello%20BB%20Travels!%20I%20would%20like%20to%20inquire%20about%20ticket%20booking.`;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity (Original Black & Gold) */}
          <div
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-950/40 group-hover:scale-105 transition">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-2xl font-black text-white tracking-wider font-serif">
                  {COMPANY_DETAILS.name}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">
                  MADURAI
                </span>
              </div>
              <p className="text-[11px] text-amber-400 font-medium tracking-wide">
                {COMPANY_DETAILS.tagline}
              </p>
            </div>
          </div>

          {/* Navigation Menu (EXACTLY THREE PAGES) */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => onNavigate('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'home'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onNavigate('booking')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'booking'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Our Ticket Booking</span>
            </button>

            <button
              onClick={() => onNavigate('gallery')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Gallery</span>
            </button>
          </nav>

          {/* Quick Actions: Phone & WhatsApp */}
          <div className="flex items-center gap-2.5">
            <a
              href={`tel:${COMPANY_DETAILS.phone}`}
              className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{COMPANY_DETAILS.phone}</span>
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp Booking</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Mobile Navigation bar (EXACTLY THREE PAGES) */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => onNavigate('home')}
            className={`flex flex-col items-center gap-1 py-1 px-3 font-bold ${
              activeTab === 'home' ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
          <button
            onClick={() => onNavigate('booking')}
            className={`flex flex-col items-center gap-1 py-1 px-3 font-bold ${
              activeTab === 'booking' ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Our Ticket Booking</span>
          </button>
          <button
            onClick={() => onNavigate('gallery')}
            className={`flex flex-col items-center gap-1 py-1 px-3 font-bold ${
              activeTab === 'gallery' ? 'text-amber-400' : 'text-slate-400'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Gallery</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
