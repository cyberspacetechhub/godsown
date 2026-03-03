import useAuth from './useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_KEY = import.meta.env.VITE_API_IDENTIFIER || 'shipment_api_key_2024_secure_access_token';

const useFileUpload = () => {
  const { auth } = useAuth();

  const uploadFile = async (endpoint, file, additionalData = {}) => {
    const formData = new FormData();
    formData.append(endpoint.includes('payment') ? 'proof' : 'document', file);
    
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    try {
      const response = await fetch(`${API_URL}/upload/${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth?.token}`,
          'x-api-key': API_KEY
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  return { uploadFile };
};

export default useFileUpload;
