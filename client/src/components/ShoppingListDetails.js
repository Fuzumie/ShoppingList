import React from "react";
import "./ShoppingListDetails.css";

function ShoppingListDetails({
  shoppingList,
  newItem,
  setNewItem,
  filter,
  setFilter,
  isRenaming,
  setIsRenaming,
  newListName,
  setNewListName,
  onRenameList,
  onAddItem,
  onToggleResolved,
  onDeleteItem,
  onToggleArchive,
}) {
  const filteredItems = shoppingList.items.filter((item) => {
    if (filter === "Resolved") return item.resolved;
    if (filter === "Unresolved") return !item.resolved;
    return true;
  });

  return (
    <div className="shopping-list">
      {isRenaming ? (
        <div className="rename-container">
          <input
            type="text"
            placeholder="New list name"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
          />
          <button onClick={onRenameList}>Save</button>
          <button onClick={() => setIsRenaming(false)}>Cancel</button>
        </div>
      ) : (
        <div className="list-header">
          <h2>{shoppingList.name}</h2>
          <div className="icon-container">
            <span
              onClick={onToggleArchive}
              className={`icon-button ${shoppingList.archived ? "archived" : ""}`}
            >
              <i className="fas fa-archive"></i>
            </span>
            <span onClick={() => setIsRenaming(true)} className="icon-button">
              <i className="fas fa-pencil-alt"></i>
            </span>
          </div>
        </div>
      )}

      <div>
        <input
          type="text"
          placeholder="Input item here..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button onClick={onAddItem}>Add</button>
      </div>

      <div className="filter-buttons">
        <button onClick={() => setFilter("All")} disabled={filter === "All"}>
          All
        </button>
        <button
          onClick={() => setFilter("Unresolved")}
          disabled={filter === "Unresolved"}
        >
          Unresolved
        </button>
        <button
          onClick={() => setFilter("Resolved")}
          disabled={filter === "Resolved"}
        >
          Resolved
        </button>
      </div>

      <ul>
        {filteredItems.map((item, index) => (
          <li
            key={index}
            className={`item ${item.resolved ? "resolved" : ""}`}
          >
            <span onClick={() => onToggleResolved(index)} className="item-name">
              {item.name} {item.resolved && <span className="check-mark">✔</span>}
            </span>
            <button className="delete-btn" onClick={() => onDeleteItem(index)}>
              <i className="fa-solid fa-minus"></i>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShoppingListDetails;
