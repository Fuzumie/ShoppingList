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
      return response; // Return the data (e.g., { token, userId })
    } catch (error) {
      console.error("Signup Error:", error.response?.data || error.message); // Log error
      throw error; // Rethrow error to handle it in the component
    }
  },

  login: async (userData) => {
    try {
      const response = await api.post("/user/login", userData);
      console.log("Login Response:", response.data); // Log the response data
      return response; // Return the data (e.g., { token, userId })
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message); // Log error
      throw error; // Rethrow error to handle it in the component
    }
  },

  // Shopping Lists
  createShoppingList: async (listData) => {
    try {
      const response = await api.post("/list/create", listData);
      console.log("Create Shopping List Response:", response.data);
      return response;
    } catch (error) {
      console.error("Create Shopping List Error:", error.response?.data || error.message);
      throw error;
    }
  },

  getShoppingListById: async (listId) => {
    try {
      const response = await api.get(`/list/${listId}`);
      console.log("Get Shopping List By ID Response:", response.data);
      return response;
    } catch (error) {
      console.error("Get Shopping List By ID Error:", error.response?.data || error.message);
      throw error;
    }
  },

  getUserShoppingLists: async () => {
    try {
      const response = await api.get("/list");
      console.log("Get User Shopping Lists Response:", response.data);
      return response;
    } catch (error) {
      console.error("Get User Shopping Lists Error:", error.response?.data || error.message);
      throw error;
    }
  },

  renameShoppingList: async (listId, listData) => {
    try {
      const response = await api.put(`/list/${listId}`, listData);
      console.log("Rename Shopping List Response:", response.data);
      return response;
    } catch (error) {
      console.error("Rename Shopping List Error:", error.response?.data || error.message);
      throw error;
    }
  },

  addItemToList: async (listId, item) => {
    try {
      const response = await api.post(`/list/${listId}/items`, { item: item });
  
      console.log("Add Item to List Response:", response.data);
  
      return response.data; 
    } catch (error) {
      console.error("Add Item to List Error:", error.response?.data || error.message);
      throw error; 
    }
  },

  removeItemFromList: async (listId, itemId) => {
    try {
      const response = await api.delete(`/list/${listId}/items`, { data: { itemId } });
      console.log("Remove Item from List Response:", response.data);
      return response;
    } catch (error) {
      console.error("Remove Item from List Error:", error.response?.data || error.message);
      throw error;
    }
  },

  resolveItem: async (listId, itemId) => {
    try {
      const response = await api.put(`/list/${listId}/items/resolve`, { itemId });
      console.log("Resolve Item Response:", response.data);
      return response;
    } catch (error) {
      console.error("Resolve Item Error:", error.response?.data || error.message);
      throw error;
    }
  },

  archiveShoppingList: async (listId) => {
    try {
      console.log("Archiving shopping list with ID:", listId); // Log the listId being sent
      const response = await api.put(`/list/${listId}/archive`);
      console.log("Archive response:", response.data);
      return response;
    } catch (error) {
      console.error("Failed to archive shopping list:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteShoppingList: async (listId) => {
    try {
      console.log("Deleting shopping list with ID:", listId); // Log the listId being sent
      const response = await api.delete(`/list/${listId}`);
      console.log("Delete response:", response.data);
      return response;
    } catch (error) {
      console.error("Failed to delete shopping list:", error.response?.data || error.message);
      throw error;
    }
  },

  // User Management
  getAllUsers: async () => {
    try {
      const response = await api.get("/user/get");
      console.log("API Service - All Users Response:", response); // Log the entire response
      return response;
    } catch (error) {
      console.error("Error fetching all users:", error.response?.data || error.message);
      throw error; 
    }
  },

  inviteUserToList: async (listId, userId) => {
    try {
      const response = await api.post(`/user/${listId}/invite`, { userId });
      console.log("Invite User to List Response:", response.data);
      return response;
    } catch (error) {
      console.error("Invite User to List Error:", error.response?.data || error.message);
      throw error;
    }
  },

  getListMembers: async (listId) => {
    try {
      const response = await api.get(`/user/${listId}/members`);
      console.log("Get List Members Response:", response.data);
      return response;
    } catch (error) {
      console.error("Get List Members Error:", error.response?.data || error.message);
      throw error;
    }
  },

  removeUserFromList: async (listId, userIdToRemove) => {
    try {
      const response = await api.post(`/user/${listId}/remove`, { userIdToRemove });
      console.log(userIdToRemove)
      console.log("Remove User from List Response:", response.data);
      return response;
    } catch (error) {
      console.error("Remove User from List Error:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default apiService;
