import React, { useState, useEffect } from 'react';
import { Moon, Sun, Globe, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    // Check system dark mode preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Check saved language preference from localStorage if available
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'bn' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <div className="h-10 w-10 overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                {/* Replace the F with an image logo */}
                <img 
                  src="/path/to/your/logo.png" 
                  alt="FoodBridge Logo" 
                  className="h-8 w-8 object-contain"
                  onError={(e) => {
                    // Fallback to text if image fails to load
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<span class="text-white font-bold text-2xl">F</span>';
                  }}
                />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur-lg opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${
                scrolled
                  ? 'text-gray-900 dark:text-white'
                  : 'text-white'
              }`}>
                FoodBridge
              </span>
              <span className={`text-xs font-medium transition-colors duration-300 ${
                scrolled
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-emerald-100'
              }`}>
                Bangladesh
              </span>
            </div>
          </Link>

          {/* Navigation Links - Visible on medium screens and up */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/about" className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-300 ${
              scrolled
                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                : 'text-white hover:bg-white/10'
            }`}>
              About
            </Link>
            <Link to="/donations" className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-300 ${
              scrolled
                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                : 'text-white hover:bg-white/10'
            }`}>
              Donations
            </Link>
            <Link to="/volunteer" className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-300 ${
              scrolled
                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                : 'text-white hover:bg-white/10'
            }`}>
              Volunteer
            </Link>
            <Link to="/contact" className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors duration-300 ${
              scrolled
                ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                : 'text-white hover:bg-white/10'
            }`}>
              Contact
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-300 ${
                scrolled
                  ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  : 'hover:bg-white/10 text-white'
              }`}
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">
                {language === 'en' ? 'বাং' : 'EN'}
              </span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-300 ${
                scrolled
                  ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  : 'hover:bg-white/10 text-white'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Login/Register Buttons */}
            <div className="hidden sm:flex items-center space-x-2">
              <Link
                to="/login"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-300 ${
                  scrolled
                    ? 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                    : 'text-emerald-100 hover:bg-emerald-600/20'
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
              >
                Register
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg transition-all duration-300 hover:bg-white/10 text-white dark:text-gray-300"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, toggle based on menu state */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg rounded-b-lg mx-4 animate-in fade-in duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/about"
              className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-sm"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/donations"
              className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Donations
            </Link>
            <Link
              to="/volunteer"
              className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Volunteer
            </Link>
            <Link
              to="/contact"
              className="block px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="pt-2 flex flex-col space-y-2 sm:hidden border-t border-gray-200 dark:border-gray-800 mt-2">
              <Link
                to="/login"
                className="block px-3 py-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 font-medium text-sm"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-medium text-center shadow-sm hover:shadow-md transition-all duration-300"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Gradient Border Bottom */}
      <div className={`absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-500 ${
        scrolled ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      </div>
    </nav>
  );
};

export default Navbar;