import { useNavigate } from "react-router-dom";  // Import useNavigate
import { useAuthContext } from './useAuthContext';
import { useShoppingListContext } from './useShoppingListContext'; // Assuming you have a ShoppingListContext

export const useLogout = () => {
  const { dispatch: authDispatch } = useAuthContext();
  const { dispatch: shoppingListDispatch } = useShoppingListContext();
  const navigate = useNavigate();  // Initialize the navigate hook

  const logout = () => {
    // Remove user and token from localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Dispatch logout actions
    authDispatch({ type: 'LOGOUT' }); // Log out the user
    shoppingListDispatch({ type: 'SET_LISTS', payload: [] }); // Clear shopping lists (or reset state)
    navigate("/");
  };

  return { logout };
};
