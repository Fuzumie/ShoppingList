import { useState } from "react";
import apiService from "../utility/apiService";
import { useAuthContext } from './useAuthContext'

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext()

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null); // Reset error before trying to log in

    try {
      // Call the API to log in
      const response = await apiService.login({ email, password });

      // Assuming `response.data` contains the logged-in user
      const user = response.data;
      const token = response.data.token;
      
      // Save the user data to localStorage
      console.log("response is ok")
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      // Dispatch login action to update global state
      dispatch({ type: 'LOGIN', payload: user });
      
    } catch (err) {
      setError("Failed to log in. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return { login, error, isLoading };
};
