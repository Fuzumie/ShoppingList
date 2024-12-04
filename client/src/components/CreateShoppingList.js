import React, { useState, useEffect } from "react";
import apiService from "../utility/apiService"; // Make sure the API service is imported
import "./CreateShoppingList.css";

function CreateShoppingList({ onCreate }) {
  const [showModal, setShowModal] = useState(false);
  const [listName, setListName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]); // Initialize users as an empty array

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await apiService.getAllUsers(); // Fetch all users from the API
        setUsers(response.data || []); // Ensure we get an empty array if the response is undefined
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("There was an error fetching the users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers(); // Call the function to fetch users on mount
  }, []);

  const handleCreate = async () => {
    if (listName.trim() && selectedMembers.length > 0) {
      setLoading(true);
      setError(""); // Clear previous errors
      try {
        // Make the API call to create the shopping list
        const response = await apiService.createShoppingList({
          name: listName,
          members: selectedMembers,
        });

        if (response.data) {
          // On success, notify the parent component and close the modal
          onCreate(response.data);
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
      alert("Please provide a list name and select members.");
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
      <button className="create-button" onClick={() => setShowModal(true)}>
        Create Shopping List
      </button>

      {showModal && (
        <div className="modal" onClick={handleOutsideClick}>
          <div className="modal-content">
            <h2>Create Shopping List</h2>
            {error && <p className="error-message">{error}</p>} {/* Display error if any */}
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
                  <p>Loading users...</p> // Loading message
                ) : (
                  users
                    .filter((user) =>
                      user.name.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map((user) => (
                      <button
                        key={user._id}
                        onClick={() => toggleMember(user._id)}
                        className={selectedMembers.includes(user._id) ? "selected" : ""}
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
