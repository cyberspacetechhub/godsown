import useAuth from "./useAuth";
import axios from "../api/axios";
import { API_KEY } from "../shared/baseURL";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/auth/refresh", {
      withCredentials: true,
      headers: {
        "x-api-key": API_KEY,
        "Content-Type": "application/json"
      }
    });
    
    const { accessToken, user } = response.data.data;
    setAuth({ user, token: accessToken, roles: user.role });
    return accessToken;
  };
  return refresh;
};

export default useRefreshToken