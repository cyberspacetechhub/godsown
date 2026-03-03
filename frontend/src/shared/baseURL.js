const baseURL = import.meta.env.VITE_API_URL || "https://godsown.onrender.com/api";
const API_KEY = import.meta.env.VITE_API_IDENTIFIER || "multiservice_api_key_2024_secure";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "https://godsown.onrender.com";

export { baseURL, API_KEY, SOCKET_URL };
export default baseURL;