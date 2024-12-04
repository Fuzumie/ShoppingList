import axios from "axios";

// API Base URL
const API_BASE_URL = "http://localhost:8000";

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach authorization token to headers for protected routes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API services
const apiService = {
  // User Authentication
  signup: async (userData) => {
    try {
      const response = await api.post("/user/register", userData);
      console.log("Signup Response:", response.data); // Log the response data
      return response.data; // Return the data (e.g., { token, userId })
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message); // Log error
      throw error; // Rethrow error to handle it in the component
    }
  },

  login: async (userData) => {
    try {
      const response = await api.post("/user/login", userData);
      console.log("Login Response:", response.data); // Log the response data
      return response.data; // Return the data (e.g., { token, userId })
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message); // Log error
      throw error; // Rethrow error to handle it in the component
    }
  },

  // Shopping Lists
  createShoppingList: (listData) => api.post("/list/create", listData),
  getShoppingListById: (listId) => api.get(`/list/${listId}`),
  getUserShoppingLists: () => api.get("/list"),
  renameShoppingList: (listId, listData) => api.put(`/list/${listId}`, listData),
  addItemToList: (listId, item) => api.post(`/list/${listId}/items`, { item }),
  removeItemFromList: (listId, itemId) => api.delete(`/list/${listId}/items`, { data: { itemId } }),
  resolveItem: (listId, itemId) => api.put(`/list/${listId}/items/resolve`, { itemId }),
  archiveShoppingList: (listId) => api.put(`/list/${listId}/archive`),
  deleteShoppingList: (listId) => api.delete(`/list/${listId}`),

  // User Management
  getAllUsers: async () => {
    try {
      const response = await api.get("/user/get");
      console.log("All Users Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error.response?.data || error.message);
      throw error; 
    }
  },
  inviteUserToList: (listId, userId) => api.post(`/user/${listId}/invite`, { userId }),
  getListMembers: (listId) => api.get(`/user/${listId}/members`),
  removeUserFromList: (listId, userIdToRemove) => api.post(`/user/${listId}/remove`, { userIdToRemove }),
};

export default apiService;
