import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../utility/apiService"; // Import the API service
import ShoppingListOverview from "../components/ShoppingListOverview";
import CreateShoppingList from "../components/CreateShoppingList";

function Lists() {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [loading, setLoading] = useState(true); // For showing a loading state
  const currentUser = "John";  // Replace this with actual current user's data, if needed
  const navigate = useNavigate();

  // Fetch shopping lists on component mount
  useEffect(() => {
    const fetchShoppingLists = async () => {
      try {
        const { data } = await apiService.getUserShoppingLists(); // Fetch shopping lists from the backend
        setShoppingLists(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch shopping lists:", error);
        setLoading(false);
      }
    };

    fetchShoppingLists();
  }, []);

  // Create new shopping list
  const handleCreate = async (newList) => {
    try {
      const { data } = await apiService.createShoppingList(newList); // Make an API call to create a new list
      setShoppingLists((prevLists) => [...prevLists, data]); // Add the new list to the state
    } catch (error) {
      console.error("Failed to create shopping list:", error);
    }
  };

  // Delete a shopping list
  const handleDelete = async (id) => {
    try {
      await apiService.deleteShoppingList(id); // Make an API call to delete the list
      setShoppingLists((prevLists) => prevLists.filter((list) => list.id !== id)); // Remove the deleted list from state
    } catch (error) {
      console.error("Failed to delete shopping list:", error);
    }
  };

  // Archive or unarchive a shopping list
  const handleArchive = async (id) => {
    try {
      const listToArchive = shoppingLists.find((list) => list.id === id);
  
      // Send a request to archive or unarchive the list
      await apiService.archiveShoppingList(id);
  
      // Update the local state to toggle the archived status of the list
      setShoppingLists((prevLists) =>
        prevLists.map((list) =>
          list.id === id
            ? { ...list, archived: !listToArchive.archived }  // Toggle the archived status
            : list
        )
      );
    } catch (error) {
      console.error("Failed to archive shopping list:", error);
    }
  };
  

  // Open the shopping list details
  const handleOpenDetails = (id) => {
    navigate(`/details/${id}`);
  };

  if (loading) {
    return <div>Loading shopping lists...</div>;
  }

  return (
    <div className="lists-page">
      <CreateShoppingList onCreate={handleCreate} />
      <ShoppingListOverview
        shoppingLists={shoppingLists}
        currentUser={currentUser}
        handleDelete={handleDelete}
        handleArchive={handleArchive}
        onOpenDetails={handleOpenDetails}
      />
    </div>
  );
}

export default Lists;
