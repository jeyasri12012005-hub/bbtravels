import React, { useState, useEffect } from 'react';
import { Seat, Gender, BookingFormDetails } from '../types/bus';
import { MalePassengerModel, FemalePassengerModel } from './PassengerModel';
import { COMPANY_DETAILS } from '../data/initialBusData';
import {
  User,
  Calendar,
  MapPin,
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Users,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface BookingFormProps {
  availableSeats: Seat[];
  selectedSeatIds: string[];
  onToggleSeat: (seatId: string) => void;
  onSubmitBooking: (bookingDetails: BookingFormDetails) => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  availableSeats,
  selectedSeatIds,
  onToggleSeat,
  onSubmitBooking,
}) => {
  const [passengerName, setPassengerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('7598499066');
  const [gender, setGender] = useState<Gender>('male');
  const [fromCity, setFromCity] = useState('Madurai');
  const [toCity, setToCity] = useState('Chennai');
  const [journeyDate, setJourneyDate] = useState('2026-11-09');
  const [passengerCount, setPassengerCount] = useState<number>(selectedSeatIds.length || 1);
  const [boardingPoint, setBoardingPoint] = useState('Mattuthavani Omni Bus Stand');
  const [droppingPoint, setDroppingPoint] = useState('Koyambedu CMBT');
  const [error, setError] = useState<string | null>(null);

  // Update passenger count when seats are selected/deselected
  useEffect(() => {
    if (selectedSeatIds.length > 0) {
      setPassengerCount(selectedSeatIds.length);
    }
  }, [selectedSeatIds.length]);

  // Update boarding/dropping points when cities change
  useEffect(() => {
    const defaultBoarding =
      COMPANY_DETAILS.boardingPoints[fromCity as keyof typeof COMPANY_DETAILS.boardingPoints]?.[0] ||
      `${fromCity} Main Stand`;
    setBoardingPoint(defaultBoarding);
  }, [fromCity]);

  useEffect(() => {
    const defaultDropping =
      COMPANY_DETAILS.boardingPoints[toCity as keyof typeof COMPANY_DETAILS.boardingPoints]?.[0] ||
      `${toCity} Main Stand`;
    setDroppingPoint(defaultDropping);
  }, [toCity]);

  // Fare Calculation
  const seatPrice = 850;
  const count = selectedSeatIds.length || 1;
  const baseTotal = count * seatPrice;
  const gst = Math.round(baseTotal * 0.05);
  const totalAmount = baseTotal + gst;

  const handleBookViaWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (selectedSeatIds.length === 0) {
      setError('Please select at least one seat from the bus seat layout above.');
      return;
    }

    if (!passengerName.trim()) {
      setError('Please enter the passenger name.');
      return;
    }

    if (!mobileNumber.trim()) {
      setError('Please enter a valid mobile number.');
      return;
    }

    if (fromCity === toCity) {
      setError('Origin and destination cities cannot be identical.');
      return;
    }

    const bookingDetails: BookingFormDetails = {
      passengerName: passengerName.trim(),
      mobileNumber: mobileNumber.trim(),
      gender,
      fromCity,
      toCity,
      journeyDate,
      passengerCount: count,
      boardingPoint,
      droppingPoint,
      selectedSeats: selectedSeatIds,
      totalAmount,
    };

    // Format WhatsApp message strictly per requirement #4
    const message = `*BB TRAVELS - TICKET BOOKING INQUIRY* 🚍
*Passenger Name:* ${bookingDetails.passengerName}
*Mobile Number:* ${bookingDetails.mobileNumber}
*Gender:* ${bookingDetails.gender === 'male' ? 'Male' : 'Female'}
*From Location:* ${bookingDetails.fromCity} (${bookingDetails.boardingPoint})
*Destination:* ${bookingDetails.toCity} (${bookingDetails.droppingPoint})
*Journey Date:* ${bookingDetails.journeyDate}
*Passenger Count:* ${bookingDetails.passengerCount}
*Selected Seat Numbers:* ${bookingDetails.selectedSeats.join(', ')}
*Total Amount:* ₹${bookingDetails.totalAmount}

Please confirm our seat reservation. Thank you!`;

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${COMPANY_DETAILS.whatsappNumberDigits}&text=${encodeURIComponent(
      message
    )}`;

    // Submit booking internally for real-time seat update & Home Page 3D reflection
    onSubmitBooking(bookingDetails);

    // Open WhatsApp directly
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl">
      <div className="border-b border-slate-800 pb-4 mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Customer Booking Form</span>
            <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono">
              MADURAI ⇄ TAMIL NADU & BENGALURU
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Complete passenger information and book directly via company WhatsApp ({COMPANY_DETAILS.whatsapp}).
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleBookViaWhatsApp} className="space-y-5">
        {/* Step 1: Selected Seats Summary */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-blue-900/40">
              {selectedSeatIds.length}
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Selected Seats
              </div>
              <div className="text-sm font-bold text-white font-mono">
                {selectedSeatIds.length > 0 ? (
                  <span className="text-blue-400">{selectedSeatIds.join(', ')}</span>
                ) : (
                  <span className="text-amber-400 text-xs">Please tap green seat(s) on the layout</span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Estimated Total
            </div>
            <div className="text-lg font-black text-emerald-400 font-mono">
              ₹{totalAmount}
            </div>
          </div>
        </div>

        {/* Step 2: Passenger Type (Male / Female Model Driver) */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            Passenger Gender <span className="text-amber-400">* (Assigns Realistic Passenger Model)</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Male Model */}
            <label
              className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition ${
                gender === 'male'
                  ? 'bg-blue-950/70 border-blue-500 ring-2 ring-blue-500/30'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-75'
              }`}
            >
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={() => setGender('male')}
                className="hidden"
              />
              <div className="w-12 h-14 bg-slate-900 rounded-xl p-1 border border-slate-700 shrink-0">
                <MalePassengerModel />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Adult Male</span>
                  {gender === 'male' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                </div>
                <div className="text-[11px] text-slate-300">Navy shirt • Realistic Indian model</div>
              </div>
            </label>

            {/* Female Model */}
            <label
              className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition ${
                gender === 'female'
                  ? 'bg-pink-950/70 border-pink-500 ring-2 ring-pink-500/30'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 opacity-75'
              }`}
            >
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={() => setGender('female')}
                className="hidden"
              />
              <div className="w-12 h-14 bg-slate-900 rounded-xl p-1 border border-slate-700 shrink-0">
                <FemalePassengerModel />
              </div>
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Adult Female</span>
                  {gender === 'female' && <CheckCircle2 className="w-4 h-4 text-pink-400" />}
                </div>
                <div className="text-[11px] text-slate-300">Maroon kurti • Realistic Indian model</div>
              </div>
            </label>
          </div>
        </div>

        {/* Step 3: Passenger Name and Mobile Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Passenger Name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Senthil Kumar"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mobile Number <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="tel"
                required
                placeholder="7598499066"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Cities and Journey Date */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">From City</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-amber-400 absolute left-3 top-3" />
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {COMPANY_DETAILS.cities.map((city) => (
                  <option key={`from-${city}`} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">To City</label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-emerald-400 absolute left-3 top-3" />
              <select
                value={toCity}
                onChange={(e) => setToCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {COMPANY_DETAILS.cities.map((city) => (
                  <option key={`to-${city}`} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Journey Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-blue-400 absolute left-3 top-3" />
              <input
                type="date"
                required
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Step 5: Boarding Point & Dropping Point */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Boarding Point ({fromCity})
            </label>
            <select
              value={boardingPoint}
              onChange={(e) => setBoardingPoint(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {(
                COMPANY_DETAILS.boardingPoints[fromCity as keyof typeof COMPANY_DETAILS.boardingPoints] || [
                  `${fromCity} Main Stand`,
                ]
              ).map((pt) => (
                <option key={`bp-${pt}`} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Dropping Point ({toCity})
            </label>
            <select
              value={droppingPoint}
              onChange={(e) => setDroppingPoint(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {(
                COMPANY_DETAILS.boardingPoints[toCity as keyof typeof COMPANY_DETAILS.boardingPoints] || [
                  `${toCity} Main Stand`,
                ]
              ).map((pt) => (
                <option key={`dp-${pt}`} value={pt}>
                  {pt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Step 6: Prominent Mandated "BOOK NOW VIA WHATSAPP" Button */}
        <div className="pt-3 border-t border-slate-800">
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl text-sm sm:text-base font-black text-white bg-emerald-600 hover:bg-emerald-500 active:scale-98 transition shadow-xl shadow-emerald-950/60 flex items-center justify-center gap-2.5 cursor-pointer uppercase tracking-wider"
          >
            <MessageSquare className="w-5 h-5" />
            <span>BOOK NOW VIA WHATSAPP</span>
          </button>

          {/* Mandated Notice: No fake confirmation; final booking confirmed by company */}
          <div className="mt-3 text-center text-[11px] text-slate-400 leading-relaxed">
            Directly dispatches booking details to BB Travels WhatsApp helpline{' '}
            <strong className="text-white">{COMPANY_DETAILS.whatsapp}</strong>. Final booking confirmation and seat reservation
            is verified by BB Travels management.
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
