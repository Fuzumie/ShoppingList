import React, { useState, useEffect } from "react";
import apiService from "../utility/apiService"; // Assuming the service is in this path
import "./ShoppingListOverview.css";

function ShoppingListOverview({ currentUser, onOpenDetails }) {
  const [shoppingLists, setShoppingLists] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch shopping lists on component mount
  useEffect(() => {
    const fetchShoppingLists = async () => {
      try {
        const { data } = await apiService.getUserShoppingLists();
        setShoppingLists(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch shopping lists:", error);
        setLoading(false);
      }
    };

    fetchShoppingLists();
  }, []);

  const openDeleteModal = (id, e) => {
    e.stopPropagation();
    setSelectedListId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await apiService.deleteShoppingList(selectedListId);
      setShoppingLists((prevLists) =>
        prevLists.filter((list) => list.id !== selectedListId)
      );
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete shopping list:", error);
    }
  };

  const handleArchive = async (listId) => {
    try {
      const listToArchive = shoppingLists.find((list) => list.id === listId);
      await apiService.archiveShoppingList(listId);
      setShoppingLists((prevLists) =>
        prevLists.map((list) =>
          list.id === listId
            ? { ...list, archived: !listToArchive.archived }
            : list
        )
      );
    } catch (error) {
      console.error("Failed to archive shopping list:", error);
    }
  };

  if (loading) {
    return <div>Loading shopping lists...</div>;
  }

  return (
    <div className="shopping-lists-container">
      {shoppingLists.map((list) => (
        <div
          key={list.id}
          className={`shopping-list-card ${
            list.archived ? "archived-card" : ""
          }`}
          onClick={() => onOpenDetails(list.id)}
        >
          <div className="card-actions">
            {currentUser === list.owner && (
              <>
                <button onClick={(e) => openDeleteModal(list.id, e)}>
                  <i className="fas fa-trash"></i>
                </button>
              </>
            )}
            <span
              onClick={(e) => {
                e.stopPropagation();
                handleArchive(list.id);
              }}
              className={`icon-toggle ${list.archived ? "archived" : ""}`}
            >
              <i className="fas fa-archive"></i>
            </span>
          </div>
          <h3>{list.name}</h3>
          <p>Owner: {list.owner}</p>
        </div>
      ))}

      {showDeleteModal && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete this shopping list?</p>
            <button onClick={confirmDelete}>Yes</button>
            <button onClick={() => setShowDeleteModal(false)}>No</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ShoppingListOverview;
