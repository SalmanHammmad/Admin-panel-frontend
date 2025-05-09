import { useState } from 'react';
import { apiRequest } from '../utils/apiUtils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { IconButton } from '@mui/material';
import { Person as PersonIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import TextField1 from '../components/TextFields/TextField1';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [errors, setErrors] = useState({ name: '', email: '', password: '', general: '' });
  const navigate = useNavigate();

  // Regular expression to validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    // Validate name
    if (!name) {
      validationErrors.name = 'Name is required';
    }

    // Validate email
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
      // Attempt registration API request
      const data = await apiRequest(`${import.meta.env.VITE_API_URL}/users/register`, 'POST', { name, email, password });
      localStorage.setItem('user', JSON.stringify(data));

      // Display success notification
      toast.success('Registered successfully');
      navigate('/login'); // Navigate to login page after successful registration
    } catch (error) {
      console.error('Error registering:', error);

      // Set general error message based on the API response
      if (error.response && error.response.status === 400) {
        setErrors({ ...errors, general: 'User with this email already exists' });
      } else {
        setErrors({ ...errors, general: 'An error occurred during registration' });
      }
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mt-4">
     <br />
      <div className="text-center mb-4">
        <AccountCircleRoundedIcon style={{ fontSize: '4rem' }} /> {/* Material UI Account Icon */}
       
      </div>
      <form onSubmit={handleRegister}>
        {/* Name Input */}
        <TextField1
          label="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`form-control ${errors.name ? 'is-invalid' : ''}`}
          required
        />
        {errors.name && <div className="invalid-feedback">{errors.name}</div>}

        {/* Email Input */}
        <TextField1
          label="Email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => {
            if (!validateEmail(email)) {
              setErrors({ ...errors, email: 'Please enter a valid email address' });
            } else {
              setErrors({ ...errors, email: '' });
            }
          }}
          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
          required
          type="email"
        />
        {errors.email && <div className="invalid-feedback">{errors.email}</div>}

        {/* Password Input */}
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

        {/* General error message */}
        {errors.general && <div className="alert alert-danger">{errors.general}</div>}

        {/* Submit Button */}
        <button onSubmit={handleRegister} style={{ backgroundColor: '#4c714f' }} type="submit">
          <span style={{ color: 'white' }}>REGISTER</span>
        </button>
      </form>

      {/* Login link */}
      <div className="mt-3 text-center">
        <p>Already have an account? <a href="/login" onClick={() => navigate('/login')}>Login now</a></p>
      </div>
    </div>
  );
};

export default RegisterScreen;
