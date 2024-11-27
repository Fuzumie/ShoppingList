import React, { useState } from "react";
import "./ShoppingListOverview.css";

function ShoppingListOverview({
  shoppingLists,
  currentUser,
  handleDelete,
  handleArchive,
  onOpenDetails,
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState(null);

  const openDeleteModal = (id, e) => {
    e.stopPropagation();
    setSelectedListId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    handleDelete(selectedListId);
    setShowDeleteModal(false);
  };

  return (
    <div className="shopping-lists-container">
      {shoppingLists.map((list) => (
        <div
          key={list.id}
          className="shopping-list-card"
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
