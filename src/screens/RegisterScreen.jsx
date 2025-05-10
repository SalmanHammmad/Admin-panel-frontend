// frontend/src/RegisterScreen.jsx
import { useState, useEffect } from "react";
import { apiRequest } from "../utils/apiUtils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IconButton, CircularProgress } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TextField1 from "../components/TextFields/TextField1";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", password: "", general: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [hasAdmin, setHasAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const data = await apiRequest(`${import.meta.env.VITE_API_URL}/users/has-admin`, "GET");
        setHasAdmin(data.hasAdmin);
      } catch (error) {
        console.error("Error checking admin existence:", error);
        setErrors({ ...errors, general: "Failed to check admin status" });
      }
    };
    checkAdmin();
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleInputChange = (field, value) => {
    if (errors[field] || errors.general) {
      setErrors({ ...errors, [field]: "", general: "" });
    }
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);
  };

  const handleRegister = async (e, asAdmin = false) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({ name: "", email: "", password: "", general: "" });

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();
    let validationErrors = {};

    if (!trimmedName) {
      validationErrors.name = "Name is required";
    } else if (trimmedName.length < 2) {
      validationErrors.name = "Name must be at least 2 characters long";
    }

    if (!trimmedEmail) {
      validationErrors.email = "Email is required";
    } else if (!validateEmail(trimmedEmail)) {
      validationErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      validationErrors.password = "Password is required";
    } else if (!validatePassword(password)) {
      validationErrors.password = "Password must be at least 6 characters long";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiRequest(
        `${import.meta.env.VITE_API_URL}/users/register`,
        "POST",
        { name: trimmedName, email: trimmedEmail, password, isAdmin: asAdmin }
      );
      console.log("Register response:", data);

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
      toast.success("Registered successfully");
      navigate("/login");
    } catch (error) {
      console.error("Register error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      if (error.response) {
        if (error.response.status === 400) {
          setErrors({ ...errors, general: error.response.data.message || "User with this email already exists" });
        } else if (error.response.status === 403) {
          setErrors({ ...errors, general: "An admin already exists" });
        } else if (error.response.status === 404) {
          setErrors({ ...errors, general: "Register endpoint not found. Check server configuration." });
        } else {
          setErrors({ ...errors, general: error.response.data.message || "An error occurred during registration" });
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
      handleRegister(e, false);
    }
  };

  if (hasAdmin === null) {
    return (
      <div className="container mt-4 text-center">
        <CircularProgress />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <br />
      <div className="text-center mb-4">
        <AccountCircleRoundedIcon style={{ fontSize: "4rem" }} />
        <h2>Registration</h2>
      </div>
      <form onSubmit={(e) => handleRegister(e, false)} onKeyPress={handleKeyPress}>
        <div className="mb-3">
          <TextField1
            label="Name"
            name="name"
            value={name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            required
            disabled={isLoading}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <TextField1
            label="Email"
            name="email"
            value={email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            onBlur={() => {
              const trimmedEmail = email.trim().toLowerCase();
              if (!validateEmail(trimmedEmail)) {
                setErrors({ ...errors, email: "Please enter a valid email address" });
              } else {
                setErrors({ ...errors, email: "" });
              }
            }}
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            required
            type="email"
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
            onChange={(e) => handleInputChange("password", e.target.value)}
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
        <div className="d-flex gap-2">
          <button
            type="submit"
            style={{ backgroundColor: "#4c714f", color: "white" }}
            className="btn w-100"
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "REGISTER"}
          </button>
          {!hasAdmin && (
            <button
              type="button"
              style={{ backgroundColor: "#2e4a31", color: "white" }}
              className="btn w-100"
              onClick={(e) => handleRegister(e, true)}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : "REGISTER AS ADMIN"}
            </button>
          )}
        </div>
      </form>
      <div className="mt-3 text-center">
        <p>
          Already have an account?{" "}
          <a href="/login" onClick={() => navigate("/login")}>
            Login now
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;