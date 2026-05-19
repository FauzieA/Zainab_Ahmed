// Centralized Ecosystem Configuration for Zainab Ahmed Application

const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

export const CONFIG = {
  // 1. API DATA ROUTING NODES
  // Dynamically swaps between local development servers and your live cloud domain
  API_BASE_URL: isDevelopment 
    ? 'http://127.0.0.1:8000' 
    : 'https://api.yourlivedomain.com', // Replace with your cloud production backend URL later

  // 2. THIRD-PARTY GATEWAY PUBLIC KEYS
  // Always use Public keys on the frontend. Never expose your Secret Keys here.
  PAYSTACK_PUBLIC_KEY: isDevelopment
    ? 'pk_test_your_public_key_here' // Replace with your actual Paystack Test Public Key
    : 'pk_live_your_actual_live_production_key', // Replace with your actual Paystack Live Public Key later

  // 3. SYSTEM APP METADATA CORNERS
  APP_NAME: 'Zainab A. Ahmed Consulting',
  SUPPORT_EMAIL: 'support@yourdomain.com',
};

export default CONFIG;