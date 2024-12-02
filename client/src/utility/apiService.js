import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

// Set up axios instance
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
  register: (userData) => api.post("/users/register", userData),
  login: (userData) => api.post("/users/login", userData),

  // Shopping Lists
  createShoppingList: (listData) =>
    api.post("/shopping-lists/create", listData),
  getShoppingListById: (listId) => api.get(`/shopping-lists/${listId}`),
  getUserShoppingLists: () => api.get("/shopping-lists"),
  renameShoppingList: (listId, listData) =>
    api.put(`/shopping-lists/${listId}`, listData),
  addItemToList: (listId, item) =>
    api.post(`/shopping-lists/${listId}/items`, { item }),
  removeItemFromList: (listId, itemId) =>
    api.delete(`/shopping-lists/${listId}/items`, { data: { itemId } }),
  resolveItem: (listId, itemId) =>
    api.put(`/shopping-lists/${listId}/items/resolve`, { itemId }),
  archiveShoppingList: (listId) =>
    api.put(`/shopping-lists/${listId}/archive`),
  deleteShoppingList: (listId) => api.delete(`/shopping-lists/${listId}`),

  // User Management
  inviteUserToList: (listId, userId) =>
    api.post(`/users/${listId}/invite`, { userId }),
  getListMembers: (listId) => api.get(`/users/${listId}/members`),
  removeUserFromList: (listId, userIdToRemove) =>
    api.post(`/users/${listId}/remove`, { userIdToRemove }),
};

export default apiService;
