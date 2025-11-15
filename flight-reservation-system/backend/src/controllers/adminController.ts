import { Request, Response } from 'express';
import { bookings, flights, users } from '../data/mockData';

export const getAnalytics = (req: Request, res: Response): void => {
  try {
    // Calculate analytics
    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalFlights = flights.length;
    const totalUsers = users.filter((u) => u.role === 'user').length;

    // Bookings per day (last 7 days)
    const today = new Date();
    const bookingsPerDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = bookings.filter((b) => {
        const bookingDate = new Date(b.bookingDate).toISOString().split('T')[0];
        return bookingDate === dateStr;
      }).length;

      bookingsPerDay.push({
        date: dateStr,
        count,
      });
    }

    // Revenue per day (last 7 days)
    const revenuePerDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const revenue = bookings
        .filter((b) => {
          const bookingDate = new Date(b.bookingDate).toISOString().split('T')[0];
          return bookingDate === dateStr;
        })
        .reduce((sum, b) => sum + b.totalAmount, 0);

      revenuePerDay.push({
        date: dateStr,
        revenue,
      });
    }

    // Popular routes
    const routeCounts: { [key: string]: number } = {};
    bookings.forEach((booking) => {
      const flight = flights.find((f) => f.id === booking.flightId);
      if (flight) {
        const route = `${flight.from} → ${flight.to}`;
        routeCounts[route] = (routeCounts[route] || 0) + 1;
      }
    });

    const popularRoutes = Object.entries(routeCounts)
      .map(([route, count]) => ({ route, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Booking status breakdown
    const confirmedBookings = bookings.filter(
      (b) => b.bookingStatus === 'confirmed'
    ).length;
    const cancelledBookings = bookings.filter(
      (b) => b.bookingStatus === 'cancelled'
    ).length;
    const refundRequests = bookings.filter(
      (b) => b.bookingStatus === 'refund-requested'
    ).length;

    res.json({
      analytics: {
        overview: {
          totalBookings,
          totalRevenue,
          totalFlights,
          totalUsers,
        },
        bookingsPerDay,
        revenuePerDay,
        popularRoutes,
        bookingStatus: {
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
          refundRequests,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getRecentBookings = (req: Request, res: Response): void => {
  try {
    const recentBookings = bookings
      .sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
      .slice(0, 10)
      .map((booking) => {
        const flight = flights.find((f) => f.id === booking.flightId);
        const user = users.find((u) => u.id === booking.userId);
        return {
          ...booking,
          flight,
          user: user ? {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          } : null,
        };
      });

    res.json({ bookings: recentBookings });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
