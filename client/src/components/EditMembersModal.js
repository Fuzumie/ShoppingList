import React, { useState, useEffect } from 'react';
import apiService from '../utility/apiService'; // Import the API service
import './EditMembersModal.css';

function EditMembersModal({ listId, owner, members, onClose, onAddMember, onRemoveMember }) {
  const [newMember, setNewMember] = useState('');
  const [allUsers, setAllUsers] = useState([]);

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

  // Add a new member to the shopping list
  const handleAdd = async () => {
    if (newMember.trim()) {
      try {
        const user = allUsers.find(user => user.username === newMember.trim());
        if (user) {
          await apiService.inviteUserToList(listId, user._id); // Assuming _id is the user ID
          onAddMember(user.username); // Update the UI by adding the member
          setNewMember('');
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error adding member:", error);
      }
    }
  };

  // Remove a member from the shopping list
  const handleRemove = async (member) => {
    try {
      const user = allUsers.find(user => user.username === member);
      if (user) {
        await apiService.removeUserFromList(listId, user._id);
        onRemoveMember(user.username); // Update the UI by removing the member
      }
    } catch (error) {
      console.error("Error removing member:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Members</h3>
        <h4>Owner: {owner.name} {owner.surname}</h4>
        <ul className="member-list">
          {members.map((member, index) => {
            // Access the name and surname from the member object
            const fullName = `${member.name} ${member.surname}`;
            return (
              <li key={index} className="member-item">
                <span>{fullName}</span> {/* Display member's full name */}
                <button onClick={() => handleRemove(fullName)} className="remove-btn">✖</button>
              </li>
            );
          })}
        </ul>
        <div className="add-member">
          <input
            type="text"
            placeholder="Add new member"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
          />
          <button onClick={handleAdd} className="add-btn">Add</button>
        </div>
        <button onClick={onClose} className="close-btn">Close</button>
      </div>
    </div>
  );
}

export default EditMembersModal;
