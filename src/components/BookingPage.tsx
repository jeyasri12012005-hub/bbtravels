import React from 'react';
import { Seat, BookingFormDetails } from '../types/bus';
import { SeatLayoutMap } from './SeatLayoutMap';
import { BookingForm } from './BookingForm';
import { Ticket } from 'lucide-react';
import { COMPANY_DETAILS } from '../data/initialBusData';

interface BookingPageProps {
  seats: Seat[];
  selectedSeatIds: string[];
  onToggleSeat: (seatId: string) => void;
  onSubmitBooking: (bookingDetails: BookingFormDetails) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  seats,
  selectedSeatIds,
  onToggleSeat,
  onSubmitBooking,
}) => {
  const availableSeats = seats.filter((s) => s.status === 'available');

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Title (Original Black & Gold) */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-3">
          <Ticket className="w-3.5 h-3.5" />
          <span>BB TRAVELS • OFFICIAL RESERVATION</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-serif">
          Our Ticket Booking
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-medium">
          Select your seats from the bus layout below, fill passenger details, and book via WhatsApp ({COMPANY_DETAILS.whatsapp}).
        </p>
      </div>

      {/* Main Grid: Clean Seat Layout + Customer Booking Form */}
      <div className="space-y-8">
        {/* Seat Selection Layout (Original Clean Visual Design Maintained) */}
        <SeatLayoutMap
          seats={seats}
          selectedSeatIds={selectedSeatIds}
          onToggleSeat={onToggleSeat}
        />

        {/* Customer Booking Form */}
        <div className="max-w-3xl mx-auto">
          <BookingForm
            availableSeats={availableSeats}
            selectedSeatIds={selectedSeatIds}
            onToggleSeat={onToggleSeat}
            onSubmitBooking={onSubmitBooking}
          />
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
