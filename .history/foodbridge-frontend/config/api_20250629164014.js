// API Configuration
const getApiConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return {
    API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api',
    API_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080'
  };
};

export const { API_BASE_URL, API_URL } = getApiConfig();