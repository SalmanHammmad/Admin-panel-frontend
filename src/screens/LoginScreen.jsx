import { useState } from 'react';
import { apiRequest } from '../utils/apiUtils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // For success toast
import { IconButton } from '@mui/material';
import { Person as PersonIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import TextField1 from '../components/TextFields/TextField1';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import BackIcon from '@mui/icons-material/ArrowBack';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [errors, setErrors] = useState({ email: '', password: '', general: '' });
  const navigate = useNavigate();

  // Regular expression to validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check email onBlur (when focus is lost)
  const handleEmailBlur = () => {
    if (!validateEmail(email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address' });
    } else {
      setErrors({ ...errors, email: '' }); // Clear error if valid
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    // Validate email format
    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      validationErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!password) {
      validationErrors.password = 'Password is required';
    }

    // If validation errors exist, stop further execution
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Attempt login API request
      const data = await apiRequest(`${import.meta.env.VITE_API_URL}/users/login`, 'POST', { email, password });
      localStorage.setItem('user', JSON.stringify(data));

      // Display toast notification for successful login
      toast.success('Logged in successfully');
      navigate('/');
    } catch (error) {
      console.error('Error logging in:', error);

      // Check if error.response exists before accessing its properties
      if (error.response && error.response.status === 400) {
        setErrors({ ...errors, password: 'Email and password do not match' });
      } else if (error.response) {
        setErrors({ ...errors, general: `Error: ${error.response.statusText}` });
      } else {
        setErrors({ ...errors, general: 'Email and password do not match' });
      }
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mt-4">
      
    <br /><br /><br />
      <div className="text-center mb-4">
        <AccountCircleRoundedIcon style={{ fontSize: '4rem' }} /> {/* Material UI Account Icon */}
       
      </div>
      <form onSubmit={handleLogin}>
        
          <TextField1
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur} // Validate email when focus is lost
            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
            required
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
     
     
        <div className="mb-3 position-relative">
          <TextField1
            label="Password"
            name="password"
            value={password}
            type={showPassword ? 'text' : 'password'} // Show or hide password based on state
            onChange={(e) => setPassword(e.target.value)}
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            required
          />
          {/* Eye icon for toggling password visibility */}
          <IconButton
            aria-label="toggle password visibility"
            onClick={togglePasswordVisibility}
            edge="end"
            style={{ position: 'absolute', right: '3%', top: '55%', transform: 'translateY(-50%)' }}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        {errors.general && <div className="alert alert-danger">{errors.general}</div>}
        <button   style={{backgroundColor: '#4c714f'}} type="submit"> <span style={{color:'white'}}>LOGIN </span></button>
      </form>

      {/* Register link */}
      <div className="mt-3 text-center">
        <p>Don't have an account yet? <a href="/register" onClick={() => navigate('/register')}>Register now</a></p>
      </div>
    </div>
  );
};

export default LoginScreen;
