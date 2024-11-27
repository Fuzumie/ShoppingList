import React, { useState } from "react";
import "./CreateShoppingList.css";

function CreateShoppingList({ onCreate }) {
  const [showModal, setShowModal] = useState(false);
  const [listName, setListName] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const members = ["Gabriel", "Joseph", "Philip", "Jane"]; 

  const handleCreate = () => {
    if (listName.trim() && selectedMembers.length > 0) {
      onCreate({ name: listName, members: selectedMembers });
      setShowModal(false);
      setListName("");
      setSelectedMembers([]);
    } else {
      alert("Please provide a list name and select members.");
    }
  };

  const toggleMember = (member) => {
    if (selectedMembers.includes(member)) {
      setSelectedMembers(selectedMembers.filter((m) => m !== member));
    } else {
      setSelectedMembers([...selectedMembers, member]);
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
                {members
                  .filter((member) =>
                    member.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((member) => (
                    <button
                      key={member}
                      onClick={() => toggleMember(member)}
                      className={selectedMembers.includes(member) ? "selected" : ""}
                    >
                      {member}
                    </button>
                  ))}
              </div>
            </div>
            <button onClick={handleCreate}>Create</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateShoppingList;
