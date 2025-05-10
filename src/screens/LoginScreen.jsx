import { useState } from "react";
import { apiRequest } from "../utils/apiUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IconButton, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TextField1 from "../components/TextFields/TextField1";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailBlur = () => {
    const trimmedEmail = email.trim();
    if (!validateEmail(trimmedEmail)) {
      setErrors({ ...errors, email: "Please enter a valid email address" });
    } else {
      setErrors({ ...errors, email: "" });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ email: "", password: "", general: "" });

    const trimmedEmail = email.trim();
    let validationErrors = {};

    if (!trimmedEmail) {
      validationErrors.email = "Email is required";
    } else if (!validateEmail(trimmedEmail)) {
      validationErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const loginUrl = "/users/login?admin=true";
      console.log("Sending login request to:", loginUrl);
      const data = await apiRequest(loginUrl, "POST", {
        email: trimmedEmail,
        password,
        admin: true,
      });
      console.log("Login response:", data);

      // The response is the user object directly, not { user: ..., token: ... }
      localStorage.setItem("user", JSON.stringify(data)); // Store the entire user object
      // No need to store token in localStorage since it's in a cookie
      toast.success("Logged in successfully");
      navigate("/");
    } catch (error) {
      console.error("Login error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });

      if (error.response) {
        if (error.response.status === 400 || error.response.status === 401) {
          setErrors({ ...errors, general: "Invalid email or password" });
        } else if (error.response.status === 403) {
          setErrors({ ...errors, general: "Only admin users can log in to the admin panel" });
        } else if (error.response.status === 404) {
          setErrors({ ...errors, general: "Login endpoint not found. Check server configuration." });
        } else {
          setErrors({
            ...errors,
            general: error.response.data.message || "An error occurred during login",
          });
        }
      } else {
        setErrors({ ...errors, general: "Network error or server unavailable" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      handleLogin(e);
    }
  };

  return (
    <div className="container mt-4">
      <br />
      <br />
      <br />
      <div className="text-center mb-4">
        <AccountCircleRoundedIcon style={{ fontSize: "4rem" }} />
        <h1>Admin Panel Login</h1>
      </div>
      <form onSubmit={handleLogin} onKeyPress={handleKeyPress}>
        <div className="mb-3">
          <TextField1
            label="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            required
            disabled={isLoading}
          />
          {errors.email && <div className="invalid-feedback">{errors.email}</div>}
        </div>
        <div className="mb-3 position-relative">
          <TextField1
            label="Password"
            name="password"
            value={password}
            type={showPassword ? "text" : "password"}
            onChange={(e) => setPassword(e.target.value)}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            required
            disabled={isLoading}
          />
          <IconButton
            aria-label="toggle password visibility"
            onClick={togglePasswordVisibility}
            edge="end"
            disabled={isLoading}
            style={{
              position: "absolute",
              right: "3%",
              top: "55%",
              transform: "translateY(-50%)",
            }}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>
        {errors.general && <div className="alert alert-danger">{errors.general}</div>}
        <button
          type="submit"
          style={{ backgroundColor: "#4c714f", color: "white" }}
          className="btn w-100"
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "LOGIN"}
        </button>
      </form>
      <div className="mt-3 text-center">
        <p>
          Don't have an account yet?{" "}
          <a href="/register" onClick={() => navigate("/register")}>
            Register now
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;