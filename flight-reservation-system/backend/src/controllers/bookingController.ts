import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { bookings, flights } from '../data/mockData';
import { Booking } from '../models/types';
import { AuthRequest } from '../middleware/auth';

export const createBooking = (req: AuthRequest, res: Response): Promise<void> => {
  return new Promise((resolve) => {
    try {
      const {
        flightId,
        passengers,
        seats,
        addOns,
        paymentMethod,
      } = req.body;

      // Validation
      if (!flightId || !passengers || !seats || !paymentMethod) {
        res.status(400).json({ error: 'Missing required fields' });
        resolve();
        return;
      }

      // Check if flight exists
      const flight = flights.find((f) => f.id === flightId);
      if (!flight) {
        res.status(404).json({ error: 'Flight not found' });
        resolve();
        return;
      }

      // Check seat availability
      if (seats.length > flight.availableSeats) {
        res.status(400).json({ error: 'Not enough seats available' });
        resolve();
        return;
      }

      // Calculate total amount
      const baseFare = flight.price * passengers.length;
      const mealCost = (addOns?.meals || 0) * 15;
      const baggageCost = (addOns?.extraBaggage || 0) * 50;
      const insuranceCost = addOns?.insurance ? 25 : 0;
      const taxes = baseFare * 0.15;
      const totalAmount = baseFare + mealCost + baggageCost + insuranceCost + taxes;

      // Create booking
      const newBooking: Booking = {
        id: uuidv4(),
        userId: req.user!.id,
        flightId,
        passengers,
        seats,
        addOns: addOns || { meals: 0, extraBaggage: 0, insurance: false },
        totalAmount,
        paymentMethod,
        paymentStatus: 'completed',
        bookingStatus: 'confirmed',
        bookingDate: new Date(),
      };

      bookings.push(newBooking);

      // Update available seats
      flight.availableSeats -= seats.length;

      res.status(201).json({
        message: 'Booking created successfully',
        booking: newBooking,
      });
      resolve();
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
      resolve();
    }
  });
};

export const getUserBookings = (req: AuthRequest, res: Response): void => {
  try {
    const userBookings = bookings.filter((b) => b.userId === req.user!.id);

    // Populate flight details
    const bookingsWithFlights = userBookings.map((booking) => {
      const flight = flights.find((f) => f.id === booking.flightId);
      return {
        ...booking,
        flight,
      };
    });

    res.json({ bookings: bookingsWithFlights });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getBookingById = (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const booking = bookings.find((b) => b.id === id);

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    // Check if user owns this booking or is admin
    if (booking.userId !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Populate flight details
    const flight = flights.find((f) => f.id === booking.flightId);

    res.json({
      booking: {
        ...booking,
        flight,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const cancelBooking = (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const booking = bookings.find((b) => b.id === id);

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    // Check if user owns this booking
    if (booking.userId !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Update booking status
    booking.bookingStatus = 'cancelled';

    // Restore available seats
    const flight = flights.find((f) => f.id === booking.flightId);
    if (flight) {
      flight.availableSeats += booking.seats.length;
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const requestRefund = (req: AuthRequest, res: Response): void => {
  try {
    const { id } = req.params;
    const booking = bookings.find((b) => b.id === id);

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    // Check if user owns this booking
    if (booking.userId !== req.user!.id) {
      res.status(403).json({ error: 'Access denied' });
      return;
    }

    // Update booking status
    booking.bookingStatus = 'refund-requested';

    res.json({
      message: 'Refund request submitted successfully',
      booking,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllBookings = (req: Request, res: Response): void => {
  try {
    // Populate flight details
    const bookingsWithFlights = bookings.map((booking) => {
      const flight = flights.find((f) => f.id === booking.flightId);
      return {
        ...booking,
        flight,
      };
    });

    res.json({ bookings: bookingsWithFlights });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
