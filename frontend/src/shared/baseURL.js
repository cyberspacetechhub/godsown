const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_KEY = import.meta.env.VITE_API_IDENTIFIER || "multiservice_api_key_2024_secure";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export { baseURL, API_KEY, SOCKET_URL };
export default baseURL;