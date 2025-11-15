import { Request, Response } from 'express';
import { flights } from '../data/mockData';
import { SearchFlightRequest, Flight } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

export const searchFlights = (req: Request, res: Response): void => {
  try {
    const { from, to, departDate, passengers, class: flightClass } = req.query;

    let filteredFlights = [...flights];

    // Filter by route
    if (from) {
      filteredFlights = filteredFlights.filter((f) =>
        f.from.toLowerCase().includes((from as string).toLowerCase())
      );
    }

    if (to) {
      filteredFlights = filteredFlights.filter((f) =>
        f.to.toLowerCase().includes((to as string).toLowerCase())
      );
    }

    // Filter by date
    if (departDate) {
      filteredFlights = filteredFlights.filter((f) => f.date === departDate);
    }

    // Filter by class
    if (flightClass) {
      filteredFlights = filteredFlights.filter((f) => f.class === flightClass);
    }

    // Filter by available seats
    if (passengers) {
      const passengerCount = parseInt(passengers as string);
      filteredFlights = filteredFlights.filter(
        (f) => f.availableSeats >= passengerCount
      );
    }

    res.json({ flights: filteredFlights });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getFlightById = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const flight = flights.find((f) => f.id === id);

    if (!flight) {
      res.status(404).json({ error: 'Flight not found' });
      return;
    }

    res.json({ flight });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllFlights = (req: Request, res: Response): void => {
  try {
    res.json({ flights });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const createFlight = (req: Request, res: Response): void => {
  try {
    const flightData: Omit<Flight, 'id'> = req.body;

    // Validation
    if (
      !flightData.flightNumber ||
      !flightData.airline ||
      !flightData.from ||
      !flightData.to ||
      !flightData.departureTime ||
      !flightData.arrivalTime ||
      !flightData.price
    ) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }

    const newFlight: Flight = {
      id: uuidv4(),
      ...flightData,
    };

    flights.push(newFlight);

    res.status(201).json({
      message: 'Flight created successfully',
      flight: newFlight,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateFlight = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const updateData: Partial<Flight> = req.body;

    const flightIndex = flights.findIndex((f) => f.id === id);

    if (flightIndex === -1) {
      res.status(404).json({ error: 'Flight not found' });
      return;
    }

    flights[flightIndex] = {
      ...flights[flightIndex],
      ...updateData,
      id, // Ensure ID doesn't change
    };

    res.json({
      message: 'Flight updated successfully',
      flight: flights[flightIndex],
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteFlight = (req: Request, res: Response): void => {
  try {
    const { id } = req.params;
    const flightIndex = flights.findIndex((f) => f.id === id);

    if (flightIndex === -1) {
      res.status(404).json({ error: 'Flight not found' });
      return;
    }

    flights.splice(flightIndex, 1);

    res.json({ message: 'Flight deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
