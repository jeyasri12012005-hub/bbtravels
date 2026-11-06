export type Gender = 'male' | 'female';

export type SeatStatus = 'available' | 'booked' | 'selected';

export interface Passenger {
  name: string;
  gender: Gender;
  age?: number;
  phone?: string;
  pnr?: string;
  bookedAt?: string;
  route?: string;
}

export interface Seat {
  id: string; // e.g. 'A1', 'A2', ... 'A10', 'B1', ... 'B10'
  row: number; // 1 to 10
  column: 'left-window' | 'right-window';
  deck: 'lower' | 'upper';
  type: 'luxury-recliner' | 'semi-sleeper';
  fare: number;
  status: SeatStatus;
  passenger?: Passenger;
}

export interface BookingFormDetails {
  passengerName: string;
  mobileNumber: string;
  gender: Gender;
  fromCity: string;
  toCity: string;
  journeyDate: string;
  passengerCount: number;
  boardingPoint: string;
  droppingPoint: string;
  selectedSeats: string[];
  totalAmount: number;
}

export interface Booking {
  id: string;
  pnr: string;
  seatId: string;
  passengerName: string;
  gender: Gender;
  phone: string;
  from: string;
  to: string;
  travelDate: string;
  boardingPoint: string;
  droppingPoint: string;
  busType: string;
  fare: number;
  status: 'CONFIRMED' | 'PENDING_WHATSAPP';
  createdAt: string;
}

export type GalleryCategory = 'all' | 'exterior' | 'interior' | 'seats';

export interface GalleryPhoto {
  id: string;
  category: 'exterior' | 'interior' | 'seats';
  categoryGroup: string;
  title: string;
  description: string;
  imageUrl: string;
  fallbackUrl?: string;
  badge: string;
}
