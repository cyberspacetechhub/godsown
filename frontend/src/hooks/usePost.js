import axios from '../api/axios';

const API_KEY = import.meta.env.VITE_API_IDENTIFIER || 'multiservice_api_key_2024_secure';

const usePost = () => {
  const postData = async (url, data, token) => {
    const controller = new AbortController();

    try {
      const response = await axios.post(url, data, {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
      });

      return response;
    } catch (error) {
      // console.error('Error during POST request:', error);
      throw error; // Let the caller handle the error
    }
  };

  return postData; // Return the function, not the result of calling the function
};

export default usePost;


{/*  */}