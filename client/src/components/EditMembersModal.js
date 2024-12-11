import React, { useState, useEffect } from "react";
import apiService from "../utility/apiService";
import "./EditMembersModal.css";

function EditMembersModal({
  listId,
  owner,
  members,
  onClose,
  onAddMember,
  onRemoveMember,
}) {
  const [allUsers, setAllUsers] = useState([]); // All available users
  const [selectedUsers, setSelectedUsers] = useState(new Set()); // Users selected for adding
  const [searchQuery, setSearchQuery] = useState(""); // For search bar in both modals

  // Fetch all users from the backend
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await apiService.getAllUsers();
        setAllUsers(response.data); // Assuming the response is an array of users
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchAllUsers();
  }, []);

  // Remove a member
  const handleRemove = async (memberId) => {
    try {
      await apiService.removeUserFromList(listId, memberId);
      onRemoveMember(memberId); // Update UI after successful removal
    } catch (error) {
      console.error("Error removing member:", error.response?.data || error.message);
    }
  };

  // Handle toggle selection of a user in the Add Users Modal
  const handleToggleUserSelection = (userId) => {
    setSelectedUsers((prev) => {
      const updatedSelection = new Set(prev);
      if (updatedSelection.has(userId)) {
        updatedSelection.delete(userId); // Deselect if already selected
      } else {
        updatedSelection.add(userId); // Select if not selected
      }
      return updatedSelection;
    });
  };

  // Add selected users as members
  const handleAddSelectedUsers = async () => {
    try {
      selectedUsers.forEach(async (userId) => {
        await apiService.inviteUserToList(listId, userId);
        const user = allUsers.find((user) => user._id === userId);
        if (user) onAddMember(user);
      });
      setSelectedUsers(new Set()); // Clear selected users
    } catch (error) {
      console.error("Error adding selected users:", error);
    }
  };

  // Filter users based on search query for both modals
  const filteredUsers = allUsers.filter(
    (user) =>
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Close the modal when clicking outside
  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOutsideClick}>
      <div className="modal-container">
        {/* Remove Members Modal */}
        <div className="modal-content remove-modal">
          <button className="close-btn" onClick={onClose}>✖</button>
          <h4>Remove Members</h4>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, surname or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ul className="member-list">
            {members
              .filter((member) =>
                member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                member.surname.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((member) => (
                <li key={member._id || `${member.name}-${member.surname}`}>
                  <span>{member.name} {member.surname}</span>
                  <button
                    onClick={() => handleRemove(member._id)}
                    className="remove-btn"
                  >
                    ✖
                  </button>
                </li>
              ))}
          </ul>
        </div>

        {/* Add Members Modal */}
        <div className="modal-content add-modal">
          <button className="close-btn" onClick={onClose}>✖</button>
          <h4>Select Users to Add</h4>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, surname or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <ul className="user-selection-list">
            {filteredUsers.map((user) => (
              <li
                key={user._id}
                className={`user-item ${selectedUsers.has(user._id) ? 'selected' : ''}`}
                onClick={() => handleToggleUserSelection(user._id)}
              >
                <span>{user.name} {user.surname}</span>
              </li>
            ))}
          </ul>
          <div className="add-member">
            <button onClick={handleAddSelectedUsers} className="add-btn">
              Add Selected Members
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditMembersModal;
