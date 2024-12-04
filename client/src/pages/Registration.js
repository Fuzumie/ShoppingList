import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../utility/apiService";
import "./Registration.css";

function Registration() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    setErrors({}); // Reset errors before submission
    try {
      console.log(formData); // Log form data to verify it's correct
      const response = await apiService.signup(formData);
      console.log("API Response:", response); // Log the entire response
  
      // Check if token exists in the response
      if (response && response.token) {
        console.log("Navigating to /lists"); // Log before navigating
        localStorage.setItem("token", response.token);
        localStorage.setItem("userId", response.userId);
        navigate("/lists");
      } else {
        console.error("Response does not contain a token.");
      }
    } catch (err) {
      console.error("Error during sign-up:", err);
      const errorMessage = err.response?.data?.message || "An unexpected error occurred";
      const errorDetails = err.response?.data?.details || {};
      setErrors({ general: errorMessage, ...errorDetails });
    }
  };
  
  

  return (
    <div className="registration-container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="registration-form">
        
        <div className="form-group">
          {errors.general && <div className="error">{errors.general}</div>}
  
          <label htmlFor="name">First Name</label>
          {errors.name && <p className="error">{errors.name}</p>} {/* Name error above the input */}
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="surname">Last Name</label>
          {errors.surname && <p className="error">{errors.surname}</p>} {/* Surname error above the input */}
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="email">Email</label>
          {errors.email && <p className="error">{errors.email}</p>} {/* Email error above the input */}
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="password">Password</label>
          {errors.password && <p className="error">{errors.password}</p>} {/* Password error above the input */}
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
  
        <button type="submit" className="btn-register">
          Register
        </button>
      </form>
      <p>
        Already have an account? <a href="/">Login here</a>
      </p>
    </div>
  );
  
}

export default Registration;
