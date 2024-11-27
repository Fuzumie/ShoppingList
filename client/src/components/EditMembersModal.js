// EditMembersModal.js
import React, { useState } from 'react';
import './EditMembersModal.css';

function EditMembersModal({ members, onClose, onAddMember, onRemoveMember }) {
  const [newMember, setNewMember] = useState('');

  const handleAdd = () => {
    if (newMember.trim()) {
      onAddMember(newMember.trim());
      setNewMember('');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Members</h3>
        <ul className="member-list">
          {members.map((member, index) => (
            <li key={index} className="member-item">
              <span>{member}</span>
              <button onClick={() => onRemoveMember(member)} className="remove-btn">✖</button>
            </li>
          ))}
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
