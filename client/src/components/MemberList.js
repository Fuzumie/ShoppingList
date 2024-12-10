import React, { useState, useEffect } from "react";
import apiService from "../utility/apiService"; // Import apiService
import EditMembersModal from './EditMembersModal'; // Import the EditMembersModal
import "./MemberList.css";

function MemberList({ listId }) {
  const [owner, setOwner] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // Fetch members and owner when the component mounts
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await apiService.getListMembers(listId); // Fetch members based on listId
        setOwner(response.data.owner); // Set the owner from the response
        setMembers(response.data.members); // Set members from the response
      } catch (err) {
        setError("Failed to load members."); // Set error if the fetch fails
      } finally {
        setLoading(false); // Set loading state to false after the fetch is done
      }
    };

    fetchMembers();
  }, [listId]); // Depend on listId to refetch members if the ID changes

  // Handle opening the modal
  const handleEditMembers = () => {
    setIsModalOpen(true); // Open the modal
  };

  // Handle closing the modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  // Handle adding a member (update state)
  const handleAddMember = (newMember) => {
    setMembers((prevMembers) => [...prevMembers, newMember]); // Add the new member to the list
  };

  // Handle removing a member (update state)
  const handleRemoveMember = (memberToRemove) => {
    setMembers((prevMembers) => prevMembers.filter((member) => member !== memberToRemove)); // Remove the member from the list
  };

  if (loading) {
    return <div>Loading members...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="members">
      <div className="members-header">
        <h3>Owner: {owner?.name} {owner?.surname}</h3> {/* Display the owner's name and surname */}
      </div>
      <h4>Members:</h4>
      <ul>
        {members.map((member, index) => (
          <li key={index}>
            {member.name} {member.surname} {/* Display each member's name and surname */}
          </li>
        ))}
      </ul>
      <button onClick={handleEditMembers}>Edit Members</button> {/* Button to trigger member editing */}

      {/* Conditionally render the EditMembersModal */}
      {isModalOpen && (
        <EditMembersModal
          listId={listId}
          members={members}
          onClose={handleCloseModal}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
        />
      )}
    </div>
  );
}

export default MemberList;
