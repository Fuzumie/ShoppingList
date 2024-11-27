import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ShoppingListOverview from "../components/ShoppingListOverview";
import CreateShoppingList from "../components/CreateShoppingList";

function Lists() {
  const [shoppingLists, setShoppingLists] = useState([
    {
      id: 1,
      name: "Shopping List 1",
      owner: "John",
      archived: false,
      items: [
        { name: "Carrots x 3", resolved: false },
        { name: "Lettuce x 1", resolved: true },
      ],
      sharedWith: ["Jane", "Harry"],
    },
    {
      id: 2,
      name: "Shopping List 2",
      owner: "John",
      archived: false,
      items: [
        { name: "Milk x 2", resolved: false },
        { name: "Bread x 1", resolved: true },
      ],
      sharedWith: ["Philip", "Kate"],
    },
    {
      id: 3,
      name: "Shopping List 3",
      owner: "Felix",
      archived: false,
      items: [
        { name: "Eggs x 12", resolved: false },
        { name: "Butter x 1", resolved: false },
      ],
      sharedWith: ["Harry", "Stephanie"],
    },
  ]);

  const currentUser = "John";
  const navigate = useNavigate();

  const handleCreate = (newList) => {
    setShoppingLists([...shoppingLists, newList]);
  };

  const handleDelete = (id) => {
    const updatedLists = shoppingLists.filter((list) => list.id !== id);
    setShoppingLists(updatedLists);
  };

  const handleArchive = (id) => {
    const updatedLists = shoppingLists.map((list) =>
      list.id === id ? { ...list, archived: !list.archived } : list
    );
    setShoppingLists(updatedLists);
  };

  const handleOpenDetails = (id) => {
    navigate(`/details/${id}`);
  };

  return (
    <div className="lists-page">
    <CreateShoppingList onCreate={handleCreate} />
      
      <ShoppingListOverview
        shoppingLists={shoppingLists}
        currentUser={currentUser}
        handleDelete={handleDelete}
        handleArchive={handleArchive}
        onOpenDetails={handleOpenDetails}
      />
    </div>
  );
}

export default Lists;
