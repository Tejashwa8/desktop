export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'user' | 'admin';
}

export interface Flight {
  id: string;
  flightNumber: string;
  airline: string;
  airlineLogo: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  duration: number;
  stops: number;
  layovers?: string[];
  price: number;
  availableSeats: number;
  class: 'Economy' | 'Business' | 'First';
  date: string;
}

export interface Passenger {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  passportNumber: string;
  email: string;
  phone: string;
}

export interface Booking {
  id: string;
  userId: string;
  flightId: string;
  passengers: Passenger[];
  seats: string[];
  addOns: {
    meals: number;
    extraBaggage: number;
    insurance: boolean;
  };
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  bookingStatus: 'confirmed' | 'cancelled' | 'refund-requested';
  bookingDate: Date;
  flight?: Flight;
}

export interface SearchParams {
  from: string;
  to: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
  class: 'Economy' | 'Business' | 'First';
  roundTrip: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}
