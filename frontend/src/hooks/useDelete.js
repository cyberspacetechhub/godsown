import axios from "../api/axios";

const API_KEY = import.meta.env.VITE_API_IDENTIFIER || 'multiservice_api_key_2024_secure';

const useDelete = () => {
    
  const deleteData = async (url, token) => {
    const controller = new AbortController();
    let result;

    try {
      const response = await axios.delete(url, {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        withCredentials: true,
      });

      result = response;
    } catch (error) {
      // console.error("Error deleting data:", error.message || error);
      return { success: false, error: error.message || error };
    }

    return result; 
  };

  return deleteData;
};

export default useDelete;
