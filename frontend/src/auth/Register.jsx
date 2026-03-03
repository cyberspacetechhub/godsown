import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DarkMode, LightMode } from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';
import axios from '../../api/axios';
import { API_KEY } from '../../shared/baseURL';

const Register = () => {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledEmail = location.state?.email || '';
  const trackingNumber = location.state?.trackingNumber || '';

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { email: prefilledEmail }
  });

  const onSubmit = async (data) => {
    try {
      await axios.post('/users', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        type: 'customer'
      }, {
        headers: { 'x-api-key': API_KEY }
      });

      toast.success('Account created successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
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
        <h2 className="text-2xl font-bold text-center mb-2 text-gold">Create Account</h2>
        {trackingNumber && (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
            Track your shipment: {trackingNumber}
          </p>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">First Name *</label>
              <input
                {...register('firstName', { required: 'First name is required' })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Last Name *</label>
              <input
                {...register('lastName', { required: 'Last name is required' })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold dark:bg-gray-700 dark:border-gray-600"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email *</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold dark:bg-gray-700 dark:border-gray-600"
              readOnly={!!prefilledEmail}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              {...register('phone')}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password *</label>
            <input
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' }
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password *</label>
            <input
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm password',
                validate: value => value === watch('password') || 'Passwords do not match'
              })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gold dark:bg-gray-700 dark:border-gray-600"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gold hover:bg-gold-dark text-white py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-gold hover:underline text-sm"
          >
            Already have an account? Login
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
