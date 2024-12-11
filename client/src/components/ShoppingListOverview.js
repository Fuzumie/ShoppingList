import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../utility/apiService";
import { ShoppingListContext } from "../context/ShoppingListContext"; // Ensure correct import
import "./ShoppingListOverview.css";

function ShoppingListOverview() {
  const { shoppingLists, dispatch } = useContext(ShoppingListContext);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const onOpenDetails = (listId) => {
    navigate(`/list/${listId}`);
  };

  // Get current user from localStorage
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user")); // Assuming user is stored as JSON
    setCurrentUser(currentUser);
  }, []);

  // Fetch shopping lists
  useEffect(() => {
    const fetchShoppingLists = async () => {
      try {
        const { data } = await apiService.getUserShoppingLists();

        if (data && typeof data === "object") {
          // Combine createdLists and sharedLists into one array
          const combinedLists = [
            ...(data.createdLists || []),
            ...(data.sharedLists || []),
          ];

          // Ensure dispatch is available
          if (dispatch) {
            dispatch({ type: "SET_LISTS", payload: combinedLists });
          } else {
            console.error("Dispatch function is not available.");
          }
        } else {
          console.error("Unexpected response format:", data);
          dispatch({ type: "SET_LISTS", payload: [] });
        }
      } catch (error) {
        console.error("Failed to fetch shopping lists:", error);
        dispatch({ type: "SET_LISTS", payload: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchShoppingLists();
  }, [dispatch]);

  const openDeleteModal = (id, e) => {
    e.stopPropagation();
    setSelectedListId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await apiService.deleteShoppingList(selectedListId);
      dispatch({ type: "DELETE_LIST", payload: selectedListId });
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete shopping list:", error);
    }
  };

  const handleArchive = async (listId) => {
    try {
      const listToArchive = shoppingLists.find((list) => list._id === listId);
      await apiService.archiveShoppingList(listId);
      dispatch({
        type: "ARCHIVE_LIST",
        payload: { id: listId, archived: !listToArchive.archived },
      });
    } catch (error) {
      console.error("Failed to archive shopping list:", error);
    }
  };

  if (loading) {
    return <div>Loading shopping lists...</div>;
  }


  return (
    <div className="shopping-lists-container">
      {Array.isArray(shoppingLists) && shoppingLists.length > 0 ? (
        shoppingLists.map((list) => (
          <div
            key={list._id}
            className={`card-content ${
              list.archived ? "archived-card" : ""
            }`}
            onClick={() => onOpenDetails(list._id)}
          >
            <div className="card-actions">
              {/* Display trash icon only if currentUser is the owner */}
              {currentUser.id === list.owner?._id && (
                <button onClick={(e) => openDeleteModal(list._id, e)}>
                  <i className="fas fa-trash"></i>
                </button>
              )}
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  handleArchive(list._id);
                }}
                className={`icon-toggle ${list.archived ? "archived" : ""}`}
              >
                <i className="fas fa-archive"></i>
              </span>
            </div>
            <h3>{list.name}</h3>
            <p>
              Owner: {list.owner?.name} {list.owner?.surname || "Unknown"}
            </p>
          </div>
        ))
      ) : (
        <p>No shopping lists available.</p>
      )}

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
