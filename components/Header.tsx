'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      });

      if (response.ok) {
        setShowLogin(false);
        setPin('');
        router.push('/admin');
      } else {
        setError('Invalid PIN');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <img
                src="/images/logo.jpg"
                alt="Aroxa Crop Science"
                className="h-12 w-auto"
              />
              <div>
                <div className="text-xl font-bold" style={{ color: '#7DD50B' }}>
                  AROXA
                </div>
                <div className="text-xs text-gray-600">Crop Science</div>
              </div>
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-gray-700 hover:text-[#7DD50B] transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-700 hover:text-[#7DD50B] transition-colors font-medium"
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-[#7DD50B] transition-colors font-medium"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-[#7DD50B] transition-colors font-medium"
              >
                Contact Us
              </Link>
              <button
                onClick={() => setShowLogin(true)}
                className="bg-[#7DD50B] text-white px-6 py-2 rounded-lg hover:bg-[#6BC509] transition-colors font-medium"
              >
                Login
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden pt-4 pb-3 space-y-3 border-t border-gray-200 mt-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-700 hover:text-[#7DD50B] transition-colors font-medium py-2"
              >
                Home
              </Link>
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-700 hover:text-[#7DD50B] transition-colors font-medium py-2"
              >
                Products
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-700 hover:text-[#7DD50B] transition-colors font-medium py-2"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-700 hover:text-[#7DD50B] transition-colors font-medium py-2"
              >
                Contact Us
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogin(true);
                }}
                className="block w-full text-left bg-[#7DD50B] text-white px-6 py-3 rounded-lg hover:bg-[#6BC509] transition-colors font-medium"
              >
                Login
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Admin Login</h2>
              <button
                onClick={() => {
                  setShowLogin(false);
                  setPin('');
                  setError('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">
                  Enter 6-Digit PIN
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DD50B]"
                  placeholder="Enter PIN"
                  required
                />
              </div>

              {error && (
                <div className="mb-4 text-red-500 text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading || pin.length !== 6}
                className="w-full bg-[#7DD50B] text-white py-2 rounded-lg hover:bg-[#6BC509] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
