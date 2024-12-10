import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShoppingListContext } from "../context/ShoppingListContext"; // Import context
import ShoppingListDetails from "../components/ShoppingListDetails";
import MemberList from "../components/MemberList";
import EditMembersModal from "../components/EditMembersModal";
import apiService from "../utility/apiService";
import "./Details.css";

function Details() {
  const { id } = useParams(); // Get the shopping list ID from the URL

  const { shoppingLists, dispatch } = useContext(ShoppingListContext); // Get shoppingLists and dispatch from context
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [newItem, setNewItem] = useState("");
  const [filter, setFilter] = useState("All");
  const [newListName, setNewListName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  // Fetch shopping list details on mount
  useEffect(() => {
    const fetchShoppingListDetails = async () => {
      try {
        const { data } = await apiService.getShoppingListById(id);
        // Update the shoppingLists state with the fetched shopping list
        dispatch({ type: "SET_LISTS", payload: [data] }); // Assuming it's an array of one list
        setNewListName(data.name); // Initialize with the fetched name
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch shopping list details:", error);
        setError("Failed to fetch shopping list details");
        setLoading(false);
      }
    };

    fetchShoppingListDetails();

    // Optionally clean up if necessary
    return () => {
      // No need to clear current list here, context manages it
    };
  }, [id, dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const currentList = shoppingLists[0]; // Since we are storing a single list in state

  if (!currentList) {
    return <div>Shopping list not found.</div>;
  }

  // Add a new item to the list using context dispatch
  const handleAddItem = async () => {
    if (newItem.trim()) {
      try {
        const item = { name: newItem };
        const response = await apiService.addItemToList(currentList._id, item);
        dispatch({
          type: "ADD_ITEM",
          payload: { listId: currentList._id, item: response.data },
        });
        setNewItem(""); // Clear input after adding
      } catch (error) {
        console.error("Failed to add item:", error.message);
      }
    }
  };

  // Toggle item resolved state using context dispatch
  const toggleResolved = async (index) => {
    const item = currentList.items[index];
    try {
      await apiService.resolveItem(currentList._id, item._id);
      dispatch({
        type: "RESOLVE_ITEM",
        payload: { listId: currentList._id, itemId: item._id },
      });
    } catch (error) {
      console.error("Failed to toggle resolved state:", error.message);
    }
  };

  // Delete item using context dispatch
  const deleteItem = async (index) => {
    const item = currentList.items[index];
    try {
      await apiService.removeItemFromList(currentList._id, item._id);
      dispatch({
        type: "REMOVE_ITEM",
        payload: { listId: currentList._id, itemId: item._id },
      });
    } catch (error) {
      console.error("Failed to delete item:", error.message);
    }
  };

  // Rename the shopping list using context dispatch
  const handleRenameList = async () => {
    if (newListName.trim()) {
      try {
        await apiService.renameShoppingList(currentList._id, { name: newListName });
        dispatch({
          type: "RENAME_LIST",
          payload: { id: currentList._id, newName: newListName },
        });
        setIsRenaming(false);
      } catch (error) {
        console.error("Failed to rename list:", error.message);
      }
    }
  };

  // Toggle archived state using context dispatch
  const toggleArchive = async () => {
    try {
      await apiService.archiveShoppingList(currentList._id);
      dispatch({
        type: "ARCHIVE_LIST",
        payload: { id: currentList._id },
      });
    } catch (error) {
      console.error("Failed to toggle archive state:", error.message);
    }
  };

  return (
    <div className="details">
      <MemberList
        listId={currentList._id}
        onEditMembers={() => setShowModal(true)}
      />

      <ShoppingListDetails
        shoppingList={currentList}
        newItem={newItem}
        setNewItem={setNewItem}
        filter={filter}
        setFilter={setFilter}
        isRenaming={isRenaming}
        setIsRenaming={setIsRenaming}
        newListName={newListName}
        setNewListName={setNewListName}
        onRenameList={handleRenameList}
        onAddItem={handleAddItem}
        onToggleResolved={toggleResolved}
        onDeleteItem={deleteItem}
        onToggleArchive={toggleArchive}
      />

      {showModal && (
        <EditMembersModal
          members={currentList.sharedWith}
          onClose={() => setShowModal(false)}
          onAddMember={() => {}}
          onRemoveMember={() => {}}
        />
      )}
    </div>
  );
}

export default Details;
