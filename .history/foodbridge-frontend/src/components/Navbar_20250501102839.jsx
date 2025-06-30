import React, { useState, useEffect } from 'react';
import { Moon, Sun, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    // Check system dark mode preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${scrolled
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
                {/* Using an actual logo image */}
                <img
                  src="/logo.jpeg"
                  alt="FoodBridge Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur-lg opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className={`text-xl font-bold tracking-tight transition-colors duration-300 ${scrolled
                  ? 'text-gray-900 dark:text-white'
                  : 'text-white'
                }`}>
                FoodBridge
              </span>
              <span className={`text-xs font-medium transition-colors duration-300 ${scrolled
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-emerald-100'
                }`}>
                Bangladesh
              </span>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-4">

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-all duration-300 ${scrolled
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
          </div>
        </div>
      </div>

      {/* Gradient Border Bottom */}
      <div className={`absolute bottom-0 left-0 right-0 h-[1px] transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'
        }`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      </div>
    </nav>
  );
};

export default Navbar;