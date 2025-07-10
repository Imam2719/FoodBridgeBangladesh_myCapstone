import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <nav className="fixed w-full top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200/20 dark:border-gray-700/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link
            to="/"
            className="flex items-center space-x-3 group"
          >
            <div className="relative">
              <div className="h-10 w-10 overflow-hidden rounded-xl transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                {/* Logo fills the entire container */}
                <img 
                  src={`${process.env.PUBLIC_URL}/logo.png`}
                  alt="FoodBridge Logo" 
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    console.error("Logo failed to load");
                    // Fall back to letter if image fails to load
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<div class="h-full w-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center"><span class="text-white font-bold text-2xl">F</span></div>';
                  }}
                />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl blur-lg opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors duration-300">
                FoodBridge
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 transition-colors duration-300">
                Bangladesh
              </span>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md"
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
      <div className="absolute bottom-0 left-0 right-0 h-[1px]">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"></div>
      </div>
    </nav>
  );
};

export default Navbar;