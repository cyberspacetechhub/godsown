import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DarkMode, LightMode } from '@mui/icons-material';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import axios from '../../api/axios';
import { API_KEY } from '../../shared/baseURL';

const Login = () => {
  const { setAuth, persist, setPersist } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/auth/login', data, {
        headers: { 'x-api-key': API_KEY },
        withCredentials: true
      });

      const { accessToken, user, roles } = response.data;
      
      setAuth({ user, token: accessToken, roles });

      const redirectMap = {
        admin: '/admin',
        customer: '/customer',
        driver: '/driver',
        warehouse: '/warehouse'
      };

      navigate(from || redirectMap[roles] || '/', { replace: true });
      toast.success('Login successful');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      
      if (err.response?.status === 429) {
        toast.error('Too many login attempts. Please try again later.');
      } else {
        toast.error(errorMessage);
      }
      
      console.error('Login error:', err.response?.status, errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <nav className="px-4 py-4 bg-white shadow dark:bg-dark-card">
        <div className="container flex items-center justify-between mx-auto">
          <button onClick={() => navigate('/')} className="text-2xl font-bold text-gold hover:opacity-80 transition-opacity">
            <div className="flex items-center gap-2">
              <img src="/prilink2.svg" alt="PRILINK" className="w-[58px] h-[58px]" />
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gold">PRILINK</span>
                <span className="text-xs text-gray-600 dark:text-gray-400 -mt-1">Currior Company</span>
              </div>
            </div>
          </button>
          <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
            {isDarkMode ? <LightMode /> : <DarkMode />}
          </button>
        </div>
      </nav>
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 bg-white dark:bg-dark-card rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-gold">Login</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="persist"
              checked={persist}
              onChange={(e) => {
                setPersist(e.target.checked);
                localStorage.setItem('persist', e.target.checked);
              }}
              className="mr-2"
            />
            <label htmlFor="persist" className="text-sm">Trust this device</label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gold hover:bg-gold-dark text-white py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-gold hover:underline text-sm"
          >
            Forgot Password?
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
