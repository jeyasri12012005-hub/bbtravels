/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Seat, BookingFormDetails, GalleryPhoto } from './types/bus';
import { INITIAL_SEATS, INITIAL_GALLERY_PHOTOS, COMPANY_DETAILS } from './data/initialBusData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { BookingPage } from './components/BookingPage';
import { GalleryPage } from './components/GalleryPage';
import { CheckCircle2, MessageSquare, X } from 'lucide-react';

const LOCAL_STORAGE_SEATS_KEY = 'bb_travels_seats_v2';
const LOCAL_STORAGE_PHOTOS_KEY = 'bb_travels_gallery_verified_v5';

export default function App() {
  // Exactly THREE pages per specification
  const [activeTab, setActiveTab] = useState<'home' | 'booking' | 'gallery'>('home');

  // Seats State (Synchronized with booking page)
  const [seats, setSeats] = useState<Seat[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SEATS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved seats', e);
    }
    return INITIAL_SEATS;
  });

  // Multi-seat selection state
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);

  // Gallery Photos (with cache purging to fix empty gallery issue)
  const [photos, setPhotos] = useState<GalleryPhoto[]>(() => {
    try {
      // Purge any stale empty caches from previous revisions
      localStorage.removeItem('bb_travels_photos_3d_v1');
      localStorage.removeItem('bb_travels_photos_v1');
      localStorage.removeItem('bb_travels_photos_v2');

      const saved = localStorage.getItem(LOCAL_STORAGE_PHOTOS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_GALLERY_PHOTOS.length) {
          const hasExterior = parsed.some((p: GalleryPhoto) => p.category === 'exterior');
          const hasInterior = parsed.some((p: GalleryPhoto) => p.category === 'interior');
          const hasSeats = parsed.some((p: GalleryPhoto) => p.category === 'seats');
          if (hasExterior && hasInterior && hasSeats) {
            return parsed;
          }
        }
      }
    } catch (e) {
      console.error('Error loading saved photos', e);
    }
    return INITIAL_GALLERY_PHOTOS;
  });

  // WhatsApp Dispatch Notice (Notification banner)
  const [lastDispatchedBooking, setLastDispatchedBooking] = useState<BookingFormDetails | null>(null);

  // Sync seats to persistent localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SEATS_KEY, JSON.stringify(seats));
    } catch (e) {
      console.error(e);
    }
  }, [seats]);

  // Sync photos to persistent localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PHOTOS_KEY, JSON.stringify(photos));
    } catch (e) {
      console.error(e);
    }
  }, [photos]);

  // Toggle seat selection (synchronized across Home Page and Booking Page)
  const handleToggleSeat = (seatId: string) => {
    const targetSeat = seats.find((s) => s.id === seatId);
    if (!targetSeat || targetSeat.status === 'booked') {
      return; // Cannot select already booked seat
    }

    if (selectedSeatIds.includes(seatId)) {
      // Deselect
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seatId));
      setSeats((prev) =>
        prev.map((s) => (s.id === seatId ? { ...s, status: 'available' } : s))
      );
    } else {
      // Select
      setSelectedSeatIds((prev) => [...prev, seatId]);
      setSeats((prev) =>
        prev.map((s) => (s.id === seatId ? { ...s, status: 'selected' } : s))
      );
    }
  };

  // Handle WhatsApp Booking Dispatch
  const handleSubmitBooking = (bookingDetails: BookingFormDetails) => {
    // 1. Update the booked seats in real-time state:
    // - Turns selected seats to RED (status = 'booked')
    // - Dynamically attaches chosen passenger model (Male or Female)
    // - Home Page 3D transparent bus updates immediately with passenger seated properly inside!
    setSeats((prev) =>
      prev.map((seat) => {
        if (bookingDetails.selectedSeats.includes(seat.id)) {
          return {
            ...seat,
            status: 'booked',
            passenger: {
              name: bookingDetails.passengerName,
              gender: bookingDetails.gender,
              phone: bookingDetails.mobileNumber,
              pnr: `BB-${Math.floor(10000 + Math.random() * 90000)}`,
              bookedAt: 'WhatsApp Inquiry Dispatched',
              route: `${bookingDetails.fromCity} to ${bookingDetails.toCity}`,
            },
          };
        }
        return seat;
      })
    );

    // 2. Clear current customer selection
    setSelectedSeatIds([]);

    // 3. Show dispatch notice
    setLastDispatchedBooking(bookingDetails);
  };

  // Gallery Uploads
  const handleUploadPhoto = (newPhoto: GalleryPhoto) => {
    setPhotos((prev) => [newPhoto, ...prev]);
  };

  const handleRemovePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const navigateToBooking = (seatId?: string) => {
    if (seatId && !selectedSeatIds.includes(seatId)) {
      handleToggleSeat(seatId);
    }
    setActiveTab('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080e1b] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Navigation Bar (Three Pages Only) */}
      <Navbar
        activeTab={activeTab}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* WhatsApp Dispatch Banner Notice */}
      {lastDispatchedBooking && (
        <div className="bg-emerald-950/90 border-b border-emerald-500/40 py-2.5 px-4 text-xs text-emerald-200 flex items-center justify-between animate-fade-in z-30">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Booking inquiry for <strong>{lastDispatchedBooking.passengerName}</strong> ({lastDispatchedBooking.selectedSeats.join(', ')})
              opened on WhatsApp to <strong>{COMPANY_DETAILS.whatsapp}</strong>.
            </span>
            <span className="text-amber-300 font-medium">
              Seat(s) marked Red with {lastDispatchedBooking.gender === 'male' ? 'Male' : 'Female'} passenger model!
            </span>
            <button
              onClick={() => {
                setActiveTab('booking');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="underline font-bold text-white hover:text-amber-300 ml-1 cursor-pointer"
            >
              View Seating Layout
            </button>
          </div>
          <button
            onClick={() => setLastDispatchedBooking(null)}
            className="text-emerald-300 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Exactly Three Pages */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomePage
            onNavigateToBooking={() => navigateToBooking()}
          />
        )}

        {activeTab === 'booking' && (
          <BookingPage
            seats={seats}
            selectedSeatIds={selectedSeatIds}
            onToggleSeat={handleToggleSeat}
            onSubmitBooking={handleSubmitBooking}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryPage
            photos={photos}
            onUploadPhoto={handleUploadPhoto}
            onRemovePhoto={handleRemovePhoto}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
