import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-white shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-blue to-navy">
              <span className="text-xl font-bold text-white">✈</span>
            </div>
            <span className="text-xl font-bold text-navy">SkyWings</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <Link
              to="/"
              className="text-gray-700 transition-colors hover:text-sky-blue"
            >
              Home
            </Link>
            <Link
              to="/flights"
              className="text-gray-700 transition-colors hover:text-sky-blue"
            >
              Flights
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="text-gray-700 transition-colors hover:text-sky-blue"
              >
                My Bookings
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-gray-700 transition-colors hover:text-sky-blue"
              >
                Admin
              </Link>
            )}
            <Link
              to="/about"
              className="text-gray-700 transition-colors hover:text-sky-blue"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 transition-colors hover:text-sky-blue"
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Hello, {user?.firstName}
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white transition-all hover:bg-navy/90"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 transition-colors hover:text-sky-blue"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-sky-blue px-4 py-2 text-sm font-medium text-white transition-all hover:bg-sky-blue/90"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            <svg
              className="h-6 w-6 text-gray-700"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-200 md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
            >
              Home
            </Link>
            <Link
              to="/flights"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
            >
              Flights
            </Link>
            {isAuthenticated && (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                My Bookings
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
              >
                Admin
              </Link>
            )}
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
            >
              About
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <>
                <div className="px-3 py-2 text-sm text-gray-600">
                  Hello, {user?.firstName}
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full rounded-lg bg-navy px-3 py-2 text-left text-white hover:bg-navy/90"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg bg-sky-blue px-3 py-2 text-white hover:bg-sky-blue/90"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
