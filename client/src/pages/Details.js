import React, { useState } from "react";
import ShoppingListDetails from "../components/ShoppingListDetails";
import MemberList from "../components/MemberList";
import EditMembersModal from "../components/EditMembersModal";
import "./Details.css";

function Details() {
  const [shoppingList, setShoppingList] = useState({
    name: "grocery",
    owner: "John",
    archived: false,
    items: [
      { name: "Carrots x 3", resolved: false },
      { name: "Lettuce x 1", resolved: true },
    ],
    sharedWith: ["Jane", "Harry", "Philip", "Kate"],
  });

  const [newItem, setNewItem] = useState("");
  const [filter, setFilter] = useState("All");
  const [newListName, setNewListName] = useState(shoppingList.name);
  const [isRenaming, setIsRenaming] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Add a new item to the list
  const handleAddItem = () => {
    if (newItem.trim()) {
      const updatedItems = [
        ...shoppingList.items,
        { name: newItem, resolved: false },
      ];
      setShoppingList({ ...shoppingList, items: updatedItems });
      setNewItem("");
    }
  };

  // Toggle item resolved state
  const toggleResolved = (index) => {
    const updatedItems = shoppingList.items.map((item, i) =>
      i === index ? { ...item, resolved: !item.resolved } : item
    );
    setShoppingList({ ...shoppingList, items: updatedItems });
  };

  // Delete item
  const deleteItem = (index) => {
    const updatedItems = shoppingList.items.filter((_, i) => i !== index);
    setShoppingList({ ...shoppingList, items: updatedItems });
  };

  // Rename the shopping list
  const handleRenameList = () => {
    if (newListName.trim()) {
      setShoppingList({ ...shoppingList, name: newListName });
      setIsRenaming(false);
    }
  };

  // Toggle archived state
  const toggleArchive = () => {
    setShoppingList((prevState) => ({
      ...prevState,
      archived: !prevState.archived,
    }));
  };

  // Add a new member
  const handleAddMember = (newMember) => {
    setShoppingList((prev) => ({
      ...prev,
      sharedWith: [...prev.sharedWith, newMember],
    }));
  };

  // Remove a member
  const handleRemoveMember = (memberToRemove) => {
    setShoppingList((prev) => ({
      ...prev,
      sharedWith: prev.sharedWith.filter((member) => member !== memberToRemove),
    }));
  };

  return (
    <div className="details">
      <MemberList
        owner={shoppingList.owner}
        members={shoppingList.sharedWith}
        onEditMembers={() => setShowModal(true)}
      />
      <ShoppingListDetails
        shoppingList={shoppingList}
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
          members={shoppingList.sharedWith}
          onClose={() => setShowModal(false)}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
        />
      )}
    </div>
  );
}

export default Details;
