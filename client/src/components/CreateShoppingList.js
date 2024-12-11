import React, { useState, useEffect, useContext } from "react";
import apiService from "../utility/apiService"; // Ensure the API service is imported
import { ShoppingListContext } from "../context/ShoppingListContext"; // Import the context
import "./CreateShoppingList.css";

function CreateShoppingList() {
  const [showModal, setShowModal] = useState(false);
  const [listName, setListName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);

  const { dispatch } = useContext(ShoppingListContext); // Access the dispatch function from the context

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        // Assuming the current user's ID is stored in localStorage
        const currentUser = JSON.parse(localStorage.getItem("user")); // Parse the stored user object
        const currentUserId = currentUser?.id; // Safely access the `id` property

        const response = await apiService.getAllUsers();
        console.log("All Users Response in Component:", response);

        if (response?.data && Array.isArray(response.data)) {
          // Filter out the current user
          const filteredUsers = response.data.filter(
            (user) => user._id !== currentUserId
          );
          setUsers(filteredUsers);
        } else {
          console.warn("Unexpected API response format:", response);
          setUsers([]);
        }
      } catch (err) {
        console.error("Error fetching users in Component:", err);
        setError("There was an error fetching the users.");
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleCreate = async () => {
    if (listName.trim()) {
      setLoading(true);
      setError(""); // Clear previous errors
      try {
        // Prepare the payload for the API call
        const payload = {
          name: listName,
          sharedWith: selectedMembers, // This can be an empty array if no members are selected
        };
  
        // Make the API call to create the shopping list
        const response = await apiService.createShoppingList(payload);
  
        if (response.data) {
          // Dispatch the new list to the context
          dispatch({ type: "CREATE_LIST", payload: response.data });
  
          // Reset the form and close the modal
          setShowModal(false);
          setListName("");
          setSelectedMembers([]);
        }
      } catch (err) {
        console.error("Failed to create shopping list:", err);
        setError("There was an error creating the shopping list.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please provide a list name.");
    }
  };
  

  const toggleMember = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === "modal") {
      setShowModal(false);
    }
  };

  return (
    <div className="button-container">
      <button className="create" onClick={() => setShowModal(true)}>
        Create Shopping List
      </button>

      {showModal && (
        <div className="modal" onClick={handleOutsideClick}>
          <div className="modal-content">
            <h2>Create Shopping List</h2>
            {error && <p className="error-message">{error}</p>}{" "}
            {/* Display error if any */}
            <div>
              <label>Name your shopping list</label>
              <input
                type="text"
                placeholder="Enter the name here..."
                value={listName}
                onChange={(e) => setListName(e.target.value)}
              />
            </div>
            <div>
              <label>Select members</label>
              <input
                type="text"
                placeholder="Search member..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="members-list">
                {loading ? (
                  <p>Loading users...</p>
                ) : !users || users.length === 0 ? (
                  <p>No users available</p>
                ) : (
                  users
                    .filter((user) =>
                      `${user.name} ${user.surname}`
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((user) => (
                      <button
                        key={user._id}
                        onClick={() => toggleMember(user._id)}
                        className={
                          selectedMembers.includes(user._id) ? "selected" : ""
                        }
                      >
                        {user.name} {user.surname}
                      </button>
                    ))
                )}
              </div>
            </div>
            <button onClick={handleCreate} disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateShoppingList;
