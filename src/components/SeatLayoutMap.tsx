import React from 'react';
import { Seat } from '../types/bus';
import { Check } from 'lucide-react';
import { MalePassengerModel, FemalePassengerModel } from './PassengerModel';

interface SeatLayoutMapProps {
  seats: Seat[];
  selectedSeatIds: string[];
  onToggleSeat: (seatId: string) => void;
}

export const SeatLayoutMap: React.FC<SeatLayoutMapProps> = ({
  seats,
  selectedSeatIds,
  onToggleSeat,
}) => {
  const rowASeats = seats.filter((s) => s.id.startsWith('A')).sort((a, b) => a.row - b.row);
  const rowBSeats = seats.filter((s) => s.id.startsWith('B')).sort((a, b) => a.row - b.row);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-2xl">
      {/* Header and Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-5 border-b border-slate-800 gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Cabin Seating Layout</span>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              2+1 Luxury Recliner
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Select one or more seats. Window seats are indicated along the sides.
          </p>
        </div>

        {/* Clear Seat Legend */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-3.5 h-3.5 rounded bg-emerald-600 border border-emerald-400 shadow-[0_0_6px_#10b981]"></span>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5 text-red-400 font-medium">
            <span className="w-3.5 h-3.5 rounded bg-red-600 border border-red-400 shadow-[0_0_6px_#ef4444]"></span>
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-1.5 text-blue-400 font-medium">
            <span className="w-3.5 h-3.5 rounded bg-blue-600 border border-blue-400 shadow-[0_0_6px_#3b82f6]"></span>
            <span>Selected</span>
          </div>
        </div>
      </div>

      {/* Realistic Bus Frame Interior */}
      <div className="border-2 border-slate-800 bg-slate-950/90 rounded-2xl p-4 max-w-3xl mx-auto shadow-inner relative">
        {/* Front Cockpit Bar with Driver Position and Entrance Door */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-bold uppercase tracking-wider">
            <span>Rear Emergency Exit 🚪</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-300 font-semibold bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
              Passenger Entry Gate 🚪
            </span>
            <span className="text-amber-400 font-bold bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1.5">
              <span>Driver Seat 🛞</span>
            </span>
          </div>
        </div>

        {/* Rows Grid */}
        <div className="space-y-4">
          {/* ROW A - LEFT WINDOW */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>ROW A (Left Window Line)</span>
              </span>
              <span className="text-slate-400 font-mono text-[11px]">₹850 / Seat</span>
            </div>

            <div className="grid grid-cols-10 gap-2">
              {rowASeats.map((seat) => {
                const isSelected = selectedSeatIds.includes(seat.id) || seat.status === 'selected';
                const isBooked = seat.status === 'booked';

                let bgClass = 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-emerald-950/50 cursor-pointer hover:scale-102';
                if (isBooked) {
                  bgClass = 'bg-red-600/90 border-red-500/80 text-white cursor-not-allowed opacity-90';
                } else if (isSelected) {
                  bgClass = 'bg-blue-600 ring-2 ring-blue-400 border-blue-300 text-white shadow-blue-950/70 scale-105';
                }

                return (
                  <button
                    key={seat.id}
                    disabled={isBooked}
                    onClick={() => onToggleSeat(seat.id)}
                    className={`relative flex flex-col items-center justify-between p-1.5 h-16 rounded-xl border text-xs font-bold transition shadow-md ${bgClass}`}
                    title={
                      isBooked
                        ? `Seat ${seat.id} is booked by ${seat.passenger?.name || 'Passenger'} (${seat.passenger?.gender})`
                        : `Seat ${seat.id} is available`
                    }
                  >
                    <span className="font-mono text-xs">{seat.id}</span>

                    {/* Realistic passenger silhouette if booked */}
                    {isBooked && seat.passenger ? (
                      <div className="w-6 h-8">
                        {seat.passenger.gender === 'male' ? (
                          <MalePassengerModel />
                        ) : (
                          <FemalePassengerModel />
                        )}
                      </div>
                    ) : isSelected ? (
                      <Check className="w-4 h-4 text-white animate-bounce" />
                    ) : (
                      <span className="text-[10px] text-emerald-100 font-normal">₹850</span>
                    )}

                    <span className="text-[8px] font-mono uppercase tracking-wider text-slate-200">
                      {isBooked ? (seat.passenger?.gender === 'male' ? 'MALE' : 'FEMALE') : 'WIN'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Central Luxury Walkway Aisle */}
          <div className="py-1.5 flex items-center justify-center gap-2 border-y border-dashed border-slate-800 my-2">
            <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">
              ◄ ◄ ◄ CENTRAL CABIN WALKWAY AISLE ► ► ►
            </span>
          </div>

          {/* ROW B - RIGHT WINDOW */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>ROW B (Right Window Line)</span>
              </span>
              <span className="text-slate-400 font-mono text-[11px]">₹850 / Seat</span>
            </div>

            <div className="grid grid-cols-10 gap-2">
              {rowBSeats.map((seat) => {
                const isSelected = selectedSeatIds.includes(seat.id) || seat.status === 'selected';
                const isBooked = seat.status === 'booked';

                let bgClass = 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white shadow-emerald-950/50 cursor-pointer hover:scale-102';
                if (isBooked) {
                  bgClass = 'bg-red-600/90 border-red-500/80 text-white cursor-not-allowed opacity-90';
                } else if (isSelected) {
                  bgClass = 'bg-blue-600 ring-2 ring-blue-400 border-blue-300 text-white shadow-blue-950/70 scale-105';
                }

                return (
                  <button
                    key={seat.id}
                    disabled={isBooked}
                    onClick={() => onToggleSeat(seat.id)}
                    className={`relative flex flex-col items-center justify-between p-1.5 h-16 rounded-xl border text-xs font-bold transition shadow-md ${bgClass}`}
                    title={
                      isBooked
                        ? `Seat ${seat.id} is booked by ${seat.passenger?.name || 'Passenger'} (${seat.passenger?.gender})`
                        : `Seat ${seat.id} is available`
                    }
                  >
                    <span className="font-mono text-xs">{seat.id}</span>

                    {/* Realistic passenger silhouette if booked */}
                    {isBooked && seat.passenger ? (
                      <div className="w-6 h-8">
                        {seat.passenger.gender === 'male' ? (
                          <MalePassengerModel />
                        ) : (
                          <FemalePassengerModel />
                        )}
                      </div>
                    ) : isSelected ? (
                      <Check className="w-4 h-4 text-white animate-bounce" />
                    ) : (
                      <span className="text-[10px] text-emerald-100 font-normal">₹850</span>
                    )}

                    <span className="text-[8px] font-mono uppercase tracking-wider text-slate-200">
                      {isBooked ? (seat.passenger?.gender === 'male' ? 'MALE' : 'FEMALE') : 'WIN'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info note */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <span>* Seats A3 (Male) and B2 (Female) are initial sample passenger seats.</span>
          <span className="text-emerald-400 font-medium">Selected seats will display your chosen Male/Female model.</span>
        </div>
      </div>
    </div>
  );
};

export default SeatLayoutMap;
