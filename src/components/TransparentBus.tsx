import React, { useState } from 'react';
import { Seat, Gender } from '../types/bus';
import { MalePassengerModel, FemalePassengerModel } from './PassengerModel';
import { Sparkles, Eye, Check, AlertCircle, Info, ShieldCheck } from 'lucide-react';

interface TransparentBusProps {
  seats: Seat[];
  selectedSeatId?: string | null;
  onSelectSeat?: (seatId: string) => void;
  onBookSeatRequest?: (seatId: string) => void;
  compact?: boolean;
  interactive?: boolean;
}

export const TransparentBus: React.FC<TransparentBusProps> = ({
  seats,
  selectedSeatId,
  onSelectSeat,
  onBookSeatRequest,
  compact = false,
  interactive = true,
}) => {
  const [hoveredSeatId, setHoveredSeatId] = useState<string | null>(null);
  const [nightMode, setNightMode] = useState<boolean>(true);
  const [activeDeck, setActiveDeck] = useState<'all' | 'rowA' | 'rowB'>('all');

  const hoveredSeat = seats.find((s) => s.id === hoveredSeatId);

  // Group seats by Row A (left window) and Row B (right window)
  const rowASeats = seats.filter((s) => s.id.startsWith('A')).sort((a, b) => a.row - b.row);
  const rowBSeats = seats.filter((s) => s.id.startsWith('B')).sort((a, b) => a.row - b.row);

  const getSeatColor = (seat: Seat) => {
    if (seat.id === selectedSeatId || seat.status === 'selected') {
      return {
        type: 'selected',
        primary: '#2563EB',
        light: '#3B82F6',
        dark: '#1D4ED8',
        border: '#60A5FA',
        glow: 'rgba(59, 130, 246, 0.6)',
        label: 'Selected (Blue)',
      };
    }
    if (seat.status === 'booked') {
      return {
        type: 'booked',
        primary: '#DC2626',
        light: '#EF4444',
        dark: '#991B1B',
        border: '#F87171',
        glow: 'rgba(239, 68, 68, 0.4)',
        label: 'Booked (Red)',
      };
    }
    // Available = Green
    return {
      type: 'available',
      primary: '#059669',
      light: '#10B981',
      dark: '#047857',
      border: '#34D399',
      glow: 'rgba(16, 185, 129, 0.4)',
      label: 'Available (Green)',
    };
  };

  const handleSeatClick = (seat: Seat) => {
    if (!interactive) return;
    if (seat.status === 'booked') {
      return; // Cannot select booked seats
    }
    if (onSelectSeat) {
      onSelectSeat(seat.id);
    }
  };

  return (
    <div className="relative w-full bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-4 md:p-6 border border-slate-800 shadow-2xl overflow-hidden">
      {/* Bus Status Header & Ambient Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400">
              Live Fleet View
            </span>
            <span className="text-xs text-slate-400 font-mono">
              • BharatBenz Diamond Class AC Multi-Axle
            </span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-white tracking-wide">
            Transparent Luxury Bus • Elevated Interior Perspective
          </h3>
        </div>

        {/* Legend Badges - Seat Color System */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-medium">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"></span>
            <span>Green = Available</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/70 border border-red-500/40 text-red-300 font-medium">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_#EF4444]"></span>
            <span>Red = Booked (Seated Passenger)</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/70 border border-blue-500/40 text-blue-300 font-medium">
            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_#3B82F6]"></span>
            <span>Blue = Selected</span>
          </div>

          <button
            onClick={() => setNightMode(!nightMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition ml-1"
            title="Toggle Interior Ambient Mood"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{nightMode ? 'Night Cabin Glow' : 'Daylight Glass'}</span>
          </button>
        </div>
      </div>

      {/* Main Bus Visualization Canvas / Container */}
      <div className="relative w-full overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        <div className="min-w-[920px] max-w-[1240px] mx-auto relative select-none">
          {/* LED Destination Board across front windshield */}
          <div className="w-full flex items-center justify-between px-6 py-1.5 bg-black/90 border border-amber-500/30 rounded-t-xl mb-1 shadow-inner">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              <span className="font-mono text-xs font-bold text-amber-400 tracking-widest uppercase">
                BB TRAVELS • CHENNAI ⇄ BANGALORE ⇄ COIMBATORE ⇄ MADURAI
              </span>
            </div>
            <div className="text-[11px] font-mono text-amber-300/80">
              VEHICLE NO: TN-01-BB-7799 • 2+1 LUXURY RECLINER COACH
            </div>
          </div>

          {/* Elevated Perspective Bus Body SVG */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-950 to-slate-950 p-2 border border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <svg
              viewBox="0 0 1100 480"
              className="w-full h-auto drop-shadow-2xl"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                {/* Exterior Transparent Glass Gradients */}
                <linearGradient id="busGlassRoof" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.28" />
                  <stop offset="35%" stopColor="#0284C7" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#0F172A" stopOpacity="0.85" />
                </linearGradient>

                <linearGradient id="busChrome" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#E2E8F0" />
                  <stop offset="25%" stopColor="#94A3B8" />
                  <stop offset="50%" stopColor="#F8FAFC" />
                  <stop offset="75%" stopColor="#64748B" />
                  <stop offset="100%" stopColor="#CBD5E1" />
                </linearGradient>

                <linearGradient id="goldLivery" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#D97706" />
                  <stop offset="40%" stopColor="#FBBF24" />
                  <stop offset="80%" stopColor="#B45309" />
                  <stop offset="100%" stopColor="#F59E0B" />
                </linearGradient>

                {/* Interior Floor Wood & Glow */}
                <linearGradient id="interiorFloor" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#1E293B" />
                  <stop offset="50%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#020617" />
                </linearGradient>

                {/* Ambient Interior Strip Lighting */}
                <linearGradient id="ambientCeiling" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity={nightMode ? 0.75 : 0.3} />
                  <stop offset="50%" stopColor="#818CF8" stopOpacity={nightMode ? 0.9 : 0.4} />
                  <stop offset="100%" stopColor="#C084FC" stopOpacity={nightMode ? 0.75 : 0.3} />
                </linearGradient>

                {/* Tire Gradients */}
                <radialGradient id="tireGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="60%" stopColor="#1E293B" />
                  <stop offset="90%" stopColor="#0F172A" />
                  <stop offset="100%" stopColor="#020617" />
                </radialGradient>
                <radialGradient id="alloyRim" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F1F5F9" />
                  <stop offset="50%" stopColor="#94A3B8" />
                  <stop offset="100%" stopColor="#475569" />
                </radialGradient>
              </defs>

              {/* Road Ground Shadow */}
              <ellipse cx="550" cy="460" rx="520" ry="16" fill="#000000" opacity="0.8" />
              <ellipse cx="550" cy="458" rx="460" ry="8" fill="#000000" opacity="0.6" />

              {/* BUS EXTERIOR CHASSIS & TRANSPARENT SHELL */}
              {/* Aerodynamic Roofline & Upper Transparent Glass Canopy */}
              <path
                d="M 120 70 
                   Q 150 48 300 45 
                   L 950 45 
                   Q 1020 48 1060 85 
                   L 1060 380 
                   Q 1050 410 980 415 
                   L 260 415 
                   Q 140 415 90 350 
                   L 80 200 
                   Q 80 120 120 70 Z"
                fill="url(#busGlassRoof)"
                stroke="url(#busChrome)"
                strokeWidth="2.5"
              />

              {/* Luxury Gold & Sapphire Livery Sweep at lower chassis */}
              <path
                d="M 90 350 
                   L 260 415 
                   L 980 415 
                   Q 1030 415 1055 385 
                   L 1055 355 
                   Q 950 380 750 375 
                   Q 400 370 200 345 
                   L 90 350 Z"
                fill="url(#goldLivery)"
                opacity="0.95"
              />

              {/* Roof AC Aerodynamic Unit */}
              <path
                d="M 400 32 L 720 32 Q 740 32 750 42 L 370 42 Q 380 32 400 32 Z"
                fill="#334155"
                stroke="#64748B"
                strokeWidth="1.5"
              />
              <rect x="440" y="35" width="240" height="4" rx="2" fill="#0EA5E9" opacity="0.7" />

              {/* Front Windshield & Driver Cabin Area (Right/Front side of bus: Left is rear, Right is front) */}
              {/* Front Windshield A-pillar & Glass Curve */}
              <path
                d="M 950 45 L 1060 85 L 1050 240 L 930 230 Z"
                fill="#0284C7"
                fillOpacity="0.18"
                stroke="url(#busChrome)"
                strokeWidth="1.5"
              />

              {/* Driver Steering & Dashboard */}
              <g transform="translate(970, 240)">
                {/* Dashboard console */}
                <path d="M 0 50 L 50 35 L 75 70 L 10 80 Z" fill="#1E293B" stroke="#475569" strokeWidth="1.5" />
                {/* Steering Wheel */}
                <ellipse cx="30" cy="40" rx="14" ry="7" fill="none" stroke="#E2E8F0" strokeWidth="2.5" transform="rotate(-25 30 40)" />
                <line x1="30" y1="40" x2="30" y2="52" stroke="#94A3B8" strokeWidth="2" />
                {/* Driver Seat */}
                <path d="M-20 20 L-20 75 L0 75 L0 30 Z" fill="#0F172A" stroke="#334155" strokeWidth="1.5" />
                <rect x="-22" y="10" width="16" height="12" rx="4" fill="#1E293B" />
                {/* Driver Cabin Indicator text */}
                <text x="15" y="105" fill="#94A3B8" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
                  DRIVER CABIN
                </text>
              </g>

              {/* Front Triple LED Projector Headlamp Unit */}
              <g transform="translate(1048, 310)">
                <path d="M 0 0 L 12 10 L 10 45 L -2 40 Z" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
                <circle cx="5" cy="12" r="3.5" fill="#38BDF8" filter="drop-shadow(0 0 6px #38BDF8)" />
                <circle cx="5" cy="24" r="3.5" fill="#38BDF8" filter="drop-shadow(0 0 6px #38BDF8)" />
                <circle cx="4" cy="35" r="2.5" fill="#F59E0B" />
              </g>

              {/* Front Chrome Grille with BB TRAVELS Badge */}
              <g transform="translate(1035, 360)">
                <rect x="0" y="0" width="24" height="28" rx="3" fill="#1E293B" stroke="url(#busChrome)" strokeWidth="1.5" />
                <circle cx="12" cy="14" r="8" fill="#0F172A" stroke="url(#goldLivery)" strokeWidth="1.5" />
                <text x="12" y="17" fill="#F59E0B" fontSize="7" fontWeight="bold" textAnchor="middle">
                  BB
                </text>
              </g>

              {/* INTERIOR WALKWAY & CABIN FLOOR */}
              {/* Floor Base */}
              <path
                d="M 120 370 L 980 370 L 960 405 L 140 405 Z"
                fill="url(#interiorFloor)"
                stroke="#334155"
                strokeWidth="1"
              />
              {/* Center Aisle Carpet Runner */}
              <path
                d="M 135 385 L 965 385 L 955 397 L 145 397 Z"
                fill="#475569"
                opacity="0.4"
              />
              {/* Aisle LED courtesy lights */}
              {Array.from({ length: 9 }).map((_, i) => (
                <circle
                  key={`aisle-light-${i}`}
                  cx={180 + i * 90}
                  cy="391"
                  r="2"
                  fill="#38BDF8"
                  opacity={nightMode ? 0.9 : 0.5}
                />
              ))}

              {/* Ambient Ceiling Neon Ribbon */}
              <path
                d="M 140 70 L 950 70"
                stroke="url(#ambientCeiling)"
                strokeWidth="4"
                strokeLinecap="round"
                filter={nightMode ? 'drop-shadow(0 0 8px #818CF8)' : undefined}
              />

              {/* Panoramic Window Dividers & Glass Sheen Streaks */}
              <path
                d="M 160 55 L 230 365"
                stroke="rgba(255, 255, 255, 0.12)"
                strokeWidth="1.5"
                strokeDasharray="4 2"
              />
              <path
                d="M 330 55 L 390 365"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1.5"
              />
              <path
                d="M 510 55 L 560 365"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1.5"
              />
              <path
                d="M 690 55 L 730 365"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1.5"
              />
              <path
                d="M 870 55 L 900 365"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1.5"
              />

              {/* Diagonal Glass Sheen Reflection */}
              <path
                d="M 280 50 L 450 50 L 350 365 L 180 365 Z"
                fill="rgba(255, 255, 255, 0.04)"
              />
              <path
                d="M 640 50 L 780 50 L 680 365 L 540 365 Z"
                fill="rgba(255, 255, 255, 0.03)"
              />

              {/* ========================================================= */}
              {/* ROW A - ELEVATED UPPER/REAR INTERIOR SEATS (A1 to A10) */}
              {/* Elevated Perspective: Y ~ 100 to 220, X from 170 to 920 */}
              {/* ========================================================= */}
              <g id="row-A-seats">
                {rowASeats.map((seat, index) => {
                  const colors = getSeatColor(seat);
                  const isHovered = hoveredSeatId === seat.id;
                  const isSelected = selectedSeatId === seat.id;
                  // Distribute 10 seats across interior X space
                  // Bus front is on right (X~930), rear is on left (X~160)
                  // Let A1 be near front (index 0 at X~860) or A1 at rear.
                  // Standard Indian bus: Row 1 is near front cabin.
                  // A1 = X: 840, A2 = X: 765, ..., A10 = X: 175
                  const seatX = 840 - (seat.row - 1) * 74;
                  const seatY = 110; // Elevated upper tier

                  return (
                    <g
                      key={seat.id}
                      className={`transition-all duration-200 ${
                        interactive && seat.status !== 'booked' ? 'cursor-pointer' : ''
                      }`}
                      onClick={() => handleSeatClick(seat)}
                      onMouseEnter={() => setHoveredSeatId(seat.id)}
                      onMouseLeave={() => setHoveredSeatId(null)}
                    >
                      {/* Seat Mounting Steel Frame */}
                      <path
                        d={`M ${seatX + 16} ${seatY + 98} L ${seatX + 16} ${seatY + 115} L ${seatX + 38} ${seatY + 115} L ${seatX + 38} ${seatY + 98}`}
                        stroke="#475569"
                        strokeWidth="2.5"
                        fill="none"
                      />

                      {/* Seat Backrest (Elevated Reclined Profile) */}
                      {/* Dynamic Color: Green, Red, or Blue */}
                      <path
                        d={`M ${seatX + 10} ${seatY + 25} 
                            Q ${seatX + 27} ${seatY + 20} ${seatX + 44} ${seatY + 25} 
                            L ${seatX + 46} ${seatY + 80} 
                            Q ${seatX + 27} ${seatY + 85} ${seatX + 8} ${seatY + 80} Z`}
                        fill={colors.primary}
                        stroke={colors.border}
                        strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '1.5'}
                        filter={
                          isSelected
                            ? 'drop-shadow(0 0 10px #3B82F6)'
                            : isHovered
                            ? 'drop-shadow(0 0 6px rgba(255,255,255,0.4))'
                            : undefined
                        }
                      />

                      {/* Headrest Cushion - Dynamic Color */}
                      <rect
                        x={seatX + 14}
                        y={seatY + 4}
                        width="26"
                        height="20"
                        rx="6"
                        fill={colors.light}
                        stroke={colors.border}
                        strokeWidth="1.2"
                      />
                      {/* Headrest contour center groove */}
                      <line
                        x1={seatX + 27}
                        y1={seatY + 7}
                        x2={seatX + 27}
                        y2={seatY + 21}
                        stroke={colors.dark}
                        strokeWidth="1.5"
                      />

                      {/* Seat Contoured Cushion (Lap / Base) - Dynamic Color */}
                      <path
                        d={`M ${seatX + 6} ${seatY + 75} 
                            L ${seatX + 48} ${seatY + 75} 
                            L ${seatX + 52} ${seatY + 100} 
                            Q ${seatX + 27} ${seatY + 104} ${seatX + 2} ${seatY + 100} Z`}
                        fill={colors.light}
                        stroke={colors.border}
                        strokeWidth="1.5"
                      />

                      {/* Realistic Armrests flanking the seat */}
                      {/* Left Armrest */}
                      <rect
                        x={seatX + 3}
                        y={seatY + 60}
                        width="6"
                        height="26"
                        rx="3"
                        fill="#1E293B"
                        stroke="#475569"
                        strokeWidth="1"
                      />
                      {/* Right Armrest */}
                      <rect
                        x={seatX + 45}
                        y={seatY + 60}
                        width="6"
                        height="26"
                        rx="3"
                        fill="#1E293B"
                        stroke="#475569"
                        strokeWidth="1"
                      />

                      {/* DYNAMIC PASSENGER MODEL EMBEDDED DIRECTLY IN SEAT */}
                      {/* Passenger sits firmly inside: head on headrest, torso on backrest, lap in cushion */}
                      {seat.status === 'booked' && seat.passenger && (
                        <g transform={`translate(${seatX + 6}, ${seatY + 6}) scale(0.42, 0.72)`}>
                          {seat.passenger.gender === 'male' ? (
                            <MalePassengerModel />
                          ) : (
                            <FemalePassengerModel />
                          )}
                        </g>
                      )}

                      {/* Seat Number Badge */}
                      <g transform={`translate(${seatX + 27}, ${seatY + 120})`}>
                        <rect
                          x="-14"
                          y="-8"
                          width="28"
                          height="16"
                          rx="4"
                          fill={colors.dark}
                          stroke={colors.border}
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="4"
                          fill="#FFFFFF"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {seat.id}
                        </text>
                      </g>

                      {/* Selection Glow Indicator if selected */}
                      {isSelected && (
                        <circle
                          cx={seatX + 27}
                          cy={seatY + 50}
                          r="28"
                          fill="none"
                          stroke="#60A5FA"
                          strokeWidth="2"
                          strokeDasharray="4 3"
                          className="animate-spin"
                          style={{ transformOrigin: `${seatX + 27}px ${seatY + 50}px` }}
                        />
                      )}
                    </g>
                  );
                })}
              </g>

              {/* Center Divider / Armrest console separator in elevated 3D */}
              <line
                x1="140"
                y1="245"
                x2="950"
                y2="245"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="1.5"
              />

              {/* ========================================================= */}
              {/* ROW B - ELEVATED LOWER/FOREGROUND INTERIOR SEATS (B1 to B10) */}
              {/* Elevated Perspective: Y ~ 240 to 360, X from 170 to 920 */}
              {/* Slightly larger scale (perspective foreground) */}
              {/* ========================================================= */}
              <g id="row-B-seats">
                {rowBSeats.map((seat, index) => {
                  const colors = getSeatColor(seat);
                  const isHovered = hoveredSeatId === seat.id;
                  const isSelected = selectedSeatId === seat.id;
                  // Fore-ground X alignment, slightly shifted for 3D perspective
                  const seatX = 840 - (seat.row - 1) * 74;
                  const seatY = 240; // Foreground tier

                  return (
                    <g
                      key={seat.id}
                      className={`transition-all duration-200 ${
                        interactive && seat.status !== 'booked' ? 'cursor-pointer' : ''
                      }`}
                      onClick={() => handleSeatClick(seat)}
                      onMouseEnter={() => setHoveredSeatId(seat.id)}
                      onMouseLeave={() => setHoveredSeatId(null)}
                    >
                      {/* Seat Mounting Steel Frame */}
                      <path
                        d={`M ${seatX + 16} ${seatY + 104} L ${seatX + 16} ${seatY + 122} L ${seatX + 40} ${seatY + 122} L ${seatX + 40} ${seatY + 104}`}
                        stroke="#475569"
                        strokeWidth="2.5"
                        fill="none"
                      />

                      {/* Seat Backrest (Elevated Reclined Profile) */}
                      {/* Dynamic Color: Green, Red, or Blue */}
                      <path
                        d={`M ${seatX + 8} ${seatY + 26} 
                            Q ${seatX + 28} ${seatY + 20} ${seatX + 48} ${seatY + 26} 
                            L ${seatX + 50} ${seatY + 84} 
                            Q ${seatX + 28} ${seatY + 90} ${seatX + 6} ${seatY + 84} Z`}
                        fill={colors.primary}
                        stroke={colors.border}
                        strokeWidth={isSelected ? '2.5' : isHovered ? '2' : '1.5'}
                        filter={
                          isSelected
                            ? 'drop-shadow(0 0 12px #3B82F6)'
                            : isHovered
                            ? 'drop-shadow(0 0 6px rgba(255,255,255,0.4))'
                            : undefined
                        }
                      />

                      {/* Headrest Cushion - Dynamic Color */}
                      <rect
                        x={seatX + 13}
                        y={seatY + 4}
                        width="30"
                        height="22"
                        rx="7"
                        fill={colors.light}
                        stroke={colors.border}
                        strokeWidth="1.2"
                      />
                      {/* Headrest contour center groove */}
                      <line
                        x1={seatX + 28}
                        y1={seatY + 7}
                        x2={seatX + 28}
                        y2={seatY + 22}
                        stroke={colors.dark}
                        strokeWidth="1.5"
                      />

                      {/* Seat Contoured Cushion (Lap / Base) - Dynamic Color */}
                      <path
                        d={`M ${seatX + 4} ${seatY + 78} 
                            L ${seatX + 52} ${seatY + 78} 
                            L ${seatX + 56} ${seatY + 106} 
                            Q ${seatX + 28} ${seatY + 110} ${seatX + 0} ${seatY + 106} Z`}
                        fill={colors.light}
                        stroke={colors.border}
                        strokeWidth="1.5"
                      />

                      {/* Realistic Armrests flanking the seat */}
                      {/* Left Armrest */}
                      <rect
                        x={seatX + 1}
                        y={seatY + 62}
                        width="7"
                        height="28"
                        rx="3.5"
                        fill="#1E293B"
                        stroke="#475569"
                        strokeWidth="1"
                      />
                      {/* Right Armrest */}
                      <rect
                        x={seatX + 48}
                        y={seatY + 62}
                        width="7"
                        height="28"
                        rx="3.5"
                        fill="#1E293B"
                        stroke="#475569"
                        strokeWidth="1"
                      />

                      {/* DYNAMIC PASSENGER MODEL EMBEDDED DIRECTLY IN SEAT */}
                      {/* Sits naturally: head on headrest, torso on backrest, lap firmly in cushion */}
                      {seat.status === 'booked' && seat.passenger && (
                        <g transform={`translate(${seatX + 4}, ${seatY + 6}) scale(0.48, 0.76)`}>
                          {seat.passenger.gender === 'male' ? (
                            <MalePassengerModel />
                          ) : (
                            <FemalePassengerModel />
                          )}
                        </g>
                      )}

                      {/* Seat Number Badge */}
                      <g transform={`translate(${seatX + 28}, ${seatY + 124})`}>
                        <rect
                          x="-14"
                          y="-8"
                          width="28"
                          height="16"
                          rx="4"
                          fill={colors.dark}
                          stroke={colors.border}
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="4"
                          fill="#FFFFFF"
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="monospace"
                          textAnchor="middle"
                        >
                          {seat.id}
                        </text>
                      </g>

                      {/* Selection Glow Indicator if selected */}
                      {isSelected && (
                        <circle
                          cx={seatX + 28}
                          cy={seatY + 55}
                          r="32"
                          fill="none"
                          stroke="#60A5FA"
                          strokeWidth="2.5"
                          strokeDasharray="5 3"
                          className="animate-spin"
                          style={{ transformOrigin: `${seatX + 28}px ${seatY + 55}px` }}
                        />
                      )}
                    </g>
                  );
                })}
              </g>

              {/* BUS WHEELS & MULTI-AXLE CHASSIS */}
              {/* Front Steering Wheel Assembly (Right) */}
              <g transform="translate(890, 420)">
                {/* Wheel Arch Cutout Shadow */}
                <path d="M-40 0 C-40 -40 40 -40 40 0 Z" fill="#020617" />
                {/* Tire */}
                <circle cx="0" cy="0" r="34" fill="url(#tireGrad)" stroke="#475569" strokeWidth="2" />
                {/* Alloy Rim */}
                <circle cx="0" cy="0" r="22" fill="url(#alloyRim)" stroke="#CBD5E1" strokeWidth="1.5" />
                {/* Hub Cap with BB logo */}
                <circle cx="0" cy="0" r="8" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="2" fill="#F59E0B" />
                {/* Chrome Lug Nuts */}
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <circle
                    key={`lug-front-${deg}`}
                    cx={15 * Math.cos((deg * Math.PI) / 180)}
                    cy={15 * Math.sin((deg * Math.PI) / 180)}
                    r="1.8"
                    fill="#E2E8F0"
                  />
                ))}
              </g>

              {/* Rear Dual-Axles Assembly (Left: Axle 1 & Axle 2) */}
              {/* Rear Axle 1 */}
              <g transform="translate(320, 420)">
                <path d="M-38 0 C-38 -38 38 -38 38 0 Z" fill="#020617" />
                <circle cx="0" cy="0" r="34" fill="url(#tireGrad)" stroke="#475569" strokeWidth="2" />
                <circle cx="0" cy="0" r="22" fill="url(#alloyRim)" stroke="#CBD5E1" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="8" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="2" fill="#F59E0B" />
              </g>

              {/* Rear Axle 2 (Tag Axle) */}
              <g transform="translate(230, 420)">
                <path d="M-38 0 C-38 -38 38 -38 38 0 Z" fill="#020617" />
                <circle cx="0" cy="0" r="34" fill="url(#tireGrad)" stroke="#475569" strokeWidth="2" />
                <circle cx="0" cy="0" r="22" fill="url(#alloyRim)" stroke="#CBD5E1" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="8" fill="#0F172A" stroke="#F59E0B" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="2" fill="#F59E0B" />
              </g>

              {/* Exterior Rear View Mirror (Front Wing) */}
              <g transform="translate(1010, 110)">
                <path d="M 0 0 L 25 -20 L 32 -16 L 8 8 Z" fill="#1E293B" stroke="#475569" strokeWidth="1" />
                <rect x="24" y="-35" width="10" height="28" rx="4" fill="#0F172A" stroke="#38BDF8" strokeWidth="1.5" />
                <rect x="26" y="-32" width="6" height="22" rx="2" fill="#38BDF8" opacity="0.8" />
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Floating Hover Card / Seat Inspector */}
      {hoveredSeat && (
        <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-slate-700 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-lg ${
                hoveredSeat.id === selectedSeatId || hoveredSeat.status === 'selected'
                  ? 'bg-blue-600 border-2 border-blue-400'
                  : hoveredSeat.status === 'booked'
                  ? 'bg-red-600 border-2 border-red-400'
                  : 'bg-emerald-600 border-2 border-emerald-400'
              }`}
            >
              {hoveredSeat.id}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-base">
                  Seat {hoveredSeat.id} • {hoveredSeat.id.startsWith('A') ? 'Row A (Window)' : 'Row B (Window / Recliner)'}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    hoveredSeat.status === 'booked'
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : hoveredSeat.id === selectedSeatId
                      ? 'bg-blue-950 text-blue-400 border border-blue-800'
                      : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}
                >
                  {hoveredSeat.status === 'booked'
                    ? 'BOOKED (Red)'
                    : hoveredSeat.id === selectedSeatId
                    ? 'SELECTED (Blue)'
                    : 'AVAILABLE (Green)'}
                </span>
              </div>

              <div className="text-xs text-slate-300 mt-0.5">
                {hoveredSeat.status === 'booked' && hoveredSeat.passenger ? (
                  <span className="flex items-center gap-2">
                    <span className="text-amber-400 font-semibold">
                      Passenger: {hoveredSeat.passenger.name} ({hoveredSeat.passenger.gender === 'male' ? 'Adult Male Model' : 'Adult Female Model'})
                    </span>
                    <span className="text-slate-400">• PNR: {hoveredSeat.passenger.pnr || 'BB-CONFIRMED'}</span>
                  </span>
                ) : (
                  <span>
                    Premium Reclining Berth • USB Charging • Calf Rest • Individual AC Vent • ₹{hoveredSeat.fare}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hoveredSeat.status === 'available' && (
              <>
                <button
                  onClick={() => handleSeatClick(hoveredSeat)}
                  className={`px-4 py-2 rounded-lg font-medium text-xs md:text-sm transition flex items-center gap-1.5 ${
                    hoveredSeat.id === selectedSeatId
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/40'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  {hoveredSeat.id === selectedSeatId ? 'Seat Selected' : 'Select Seat'}
                </button>

                {onBookSeatRequest && (
                  <button
                    onClick={() => onBookSeatRequest(hoveredSeat.id)}
                    className="px-4 py-2 rounded-lg font-medium text-xs md:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold transition shadow-lg shadow-amber-950/40"
                  >
                    Book This Seat Now
                  </button>
                )}
              </>
            )}

            {hoveredSeat.status === 'booked' && (
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-red-500" />
                <span>Reserved by {hoveredSeat.passenger?.name || 'Passenger'}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer Info bar */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>
            Click on any <strong className="text-emerald-400">Green seat</strong> to select it. Upon booking, your selected{' '}
            <strong className="text-white">Male or Female passenger model</strong> will immediately appear seated in that exact seat!
          </span>
        </div>
        <div className="text-slate-400">
          Showing <span className="text-white font-mono">{seats.filter((s) => s.status === 'available').length}</span> of {seats.length} seats available
        </div>
      </div>
    </div>
  );
};

export default TransparentBus;
