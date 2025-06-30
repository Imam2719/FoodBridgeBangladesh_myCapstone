import { useState, useEffect } from 'react';
import { 
  Heart, 
  ArrowRight, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Sun, 
  Moon 
} from 'lucide-react';

const foodIcons = [
  { icon: '🍎', delay: 0 },
  { icon: '🍕', delay: 1 },
  { icon: '🥗', delay: 2 },
  { icon: '🥐', delay: 1.5 },
  { icon: '🍔', delay: 0.5 },
  { icon: '🥑', delay: 2.5 },
  { icon: '🍇', delay: 3 },
  { icon: '🥪', delay: 2.2 },
  { icon: '🍞', delay: 1.8 },
  { icon: '🥦', delay: 0.7 },
  { icon: '🥕', delay: 1.3 },
  { icon: '🍗', delay: 2.7 },
  { icon: '🍚', delay: 1.2 },
  { icon: '🌮', delay: 0.3 },
  { icon: '🥞', delay: 2.3 },
];

const LoginPreview = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [animatedFoods, setAnimatedFoods] = useState([]);
  const [error, setError] = useState('');


  useEffect(() => {
    const items = [];
    for (let i = 0; i < 20; i++) {
      const randomFood = foodIcons[Math.floor(Math.random() * foodIcons.length)];
      items.push({
        id: i,
        icon: randomFood.icon,
        size: Math.random() * 30 + 20,
        left: Math.random() * 100,
        animationDuration: Math.random() * 15 + 10,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.7 + 0.3,
      });
    }
    setAnimatedFoods(items);
  }, []);

  const handleSubmit = () => {
    setIsLoading(true);
    setError('');
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      // Uncomment to simulate an error
      // setError('Invalid email or password. Please try again.');
    }, 2000);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="flex flex-col min-h-screen w-full">
    
      <div className={`relative w-full min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        {/* Animated food background */}
        <div className="absolute inset-0 overflow-hidden">
          {animatedFoods.map((food) => (
            <div
              key={food.id}
              className="absolute"
              style={{
                fontSize: `${food.size}px`,
                left: `${food.left}%`,
                top: '-50px',
                opacity: food.opacity,
                animation: `float-up ${food.animationDuration}s linear infinite`,
                animationDelay: `${food.delay}s`,
              }}
            >
              {food.icon}
            </div>
          ))}
        </div>

        {/* Gradient overlay */}
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-b from-gray-900/70 to-gray-900/90 backdrop-blur-sm' : 'bg-gradient-to-b from-white/60 to-white/80 backdrop-blur-sm'}`}></div>

        {/* Login container */}
        <div className={`relative z-10 w-full max-w-md mx-4 p-8 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800/90 border border-gray-700' : 'bg-white/90 border border-gray-100'} backdrop-blur-md transform transition-all duration-500 hover:scale-[1.01]`}>
          {/* Brand logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="text-rose-600 animate-pulse">
              <Heart size={32} fill="#e11d48" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent">
              FoodShare
            </h2>
          </div>

          {/* Login header */}
          <div className="text-center mb-8">
            <h1 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Welcome Back
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Continue your mission to fight hunger and reduce food waste
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 bg-red-100 text-red-500 rounded-md animate-shake">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Login fields */}
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Email address
              </label>
              <div className={`flex items-center rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} focus-within:ring-2 focus-within:ring-rose-500 focus-within:border-rose-500 transition-all duration-200`}>
                <span className={`flex items-center justify-center w-10 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>@</span>
                <input
                  type="email"
                  className={`w-full py-3 px-0 border-0 focus:ring-0 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 text-gray-900 placeholder-gray-400'}`}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Password
              </label>
              <div className={`flex items-center rounded-md border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'} focus-within:ring-2 focus-within:ring-rose-500 focus-within:border-rose-500 transition-all duration-200`}>
                <span className={`flex items-center justify-center w-10 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full py-3 px-0 border-0 focus:ring-0 ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-50 text-gray-900 placeholder-gray-400'}`}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={`pr-3 ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors duration-200`}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
                <div className="relative">
                  <div className={`w-4 h-4 rounded border ${rememberMe ? 'bg-rose-600 border-rose-600' : darkMode ? 'border-gray-500' : 'border-gray-300'}`}></div>
                  {rememberMe && (
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Remember me</span>
              </div>
              <a href="#forgot" className="text-sm font-medium text-rose-600 hover:text-rose-500">
                Forgot password?
              </a>
            </div>

            <button
              onClick={handleSubmit}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white rounded-md ${isLoading ? 'bg-gray-400' : 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-600'} shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 overflow-hidden relative`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={18} />
                </>
              )}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-full h-full w-full bg-white/20 transform skew-x-12 transition-all duration-1000 group-hover:left-full"></div>
              </div>
            </button>
          </div>

          <div className={`mt-6 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <a href="#signup" className="font-semibold text-rose-600 hover:text-rose-500">
              Create account
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float-up {
          0% {
            transform: translateY(105vh) rotate(0deg) scale(1);
          }
          100% {
            transform: translateY(-50px) rotate(360deg) scale(0.8);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-5px); }
          40%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;