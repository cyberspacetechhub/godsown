import axios from '../api/axios';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from '../components/Toast';

const useLogout = () => {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            await axios.get('/logout', 
                { withCredentials: true });
        } catch (error) {
            // Ignore server logout errors - local logout is more important
        }
        
        setAuth({});
        toast.success('Logged out successfully');
    };

    return logout;
};

export default useLogout;
