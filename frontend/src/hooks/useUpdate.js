import axios from "../api/axios";

const API_KEY = import.meta.env.VITE_API_IDENTIFIER || 'multiservice_api_key_2024_secure';

const useUpdate = () => {
  const updateData = async (url, data, token) => {
    const controller = new AbortController();

    try {
      const response = await axios.put(url, data, {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      const message =
        error?.response?.data?.error || error?.message || "Unknown error";

      // Throw the error so React Query's onError can catch it
      throw new Error(message);
    }
  };

  return updateData;
};

export default useUpdate;
