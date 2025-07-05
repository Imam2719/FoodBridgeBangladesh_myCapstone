const API_CONFIG = {
  BASE_URL: window.location.hostname === 'localhost' 
    ? 'http://localhost:8080' 
    : 'https://viewlive.onrender.com'
};
export default API_CONFIG;