const ShoppingList = require("../models/shoppingListModel");
const User = require("../models/userModel");
const mongoose = require('mongoose');

const createList = async (req, res) => {
  const { name, sharedWith = [] } = req.body; // Default sharedWith to an empty array if not provided
  const currentUser = req.user._id;

  try {
    // Validate shared users
    const sharedUsers = await User.find({ _id: { $in: sharedWith } });

    if (sharedUsers.length !== sharedWith.length) {
      return res
        .status(400)
        .json({ error: "Some users in sharedWith do not exist" });
    }

    // Create the new shopping list
    const newList = new ShoppingList({
      name,
      owner: currentUser,
      sharedWith,
    });

    await newList.save();

    // Add the list to the current user's createdLists
    const user = await User.findById(currentUser);
    if (!user) {
      return res.status(404).json({ error: "Owner user not found" });
    }
    user.createdLists.push(newList._id);
    await user.save();

    // Add the list to the shared users' sharedLists
    for (const sharedUser of sharedUsers) {
      sharedUser.sharedLists.push(newList._id);
      await sharedUser.save();
    }

    // Populate the newList response with owner and sharedWith details
    const populatedList = await ShoppingList.findById(newList._id)
      .populate({ path: "owner", select: "name surname" }) // Populate owner details
      .populate({ path: "sharedWith", select: "name surname" }); // Populate sharedWith details

    // Respond with the fully populated list
    res.status(201).json(populatedList);
  } catch (error) {
    console.error("Error creating list:", error);
    res.status(500).json({ error: "Server error", message: error.message });
  }
};

const getListById = async (req, res) => {
  const { listId } = req.params;

  try {
    const shoppingList = await ShoppingList.findById(listId)
      .populate("owner", "name surname email")
      .populate("sharedWith", "name surname email");
    

    if (!shoppingList) {
      return res.status(404).json({ msg: "Shopping list not found" });
    }

    res.json(shoppingList);
  } catch (error) {
    console.error("Error occurred in getListById:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const getUserShoppingLists = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId)
      .populate({
        path: "createdLists",
        select: "name archived owner sharedWith",
        populate: [
          { path: "owner", select: "name surname" }, 
          { path: "sharedWith", select: "name surname" }, 
        ],
      })
      .populate({
        path: "sharedLists",
        select: "name archived owner sharedWith",
        populate: [
          { path: "owner", select: "name surname" }, 
          { path: "sharedWith", select: "name surname" }, 
        ],
      });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with the populated createdLists and sharedLists
    res.status(200).json({
      createdLists: user.createdLists,
      sharedLists: user.sharedLists,
    });
  } catch (error) {
    console.error("Error occurred in getUserShoppingLists:", error.message);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};


const renameList = async (req, res) => {
  const { listId } = req.params;
  const { name } = req.body;

  try {
    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ msg: "Shopping list not found" });
    }

    if (shoppingList.archived) {
      return res.status(400).json({ msg: "Cannot update an archived list" });
    }

    if (name && shoppingList.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ msg: "Only the owner can rename this list" });
    }

    if (name) {
      shoppingList.name = name;
    }

    await shoppingList.save();

    res.json(shoppingList);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const addItemToList = async (req, res) => {
  const { listId } = req.params;
  const { item } = req.body;

  try {
    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ msg: "Shopping list not found" });
    }

    if (shoppingList.archived) {
      return res
        .status(400)
        .json({ msg: "Cannot add items to an archived list" });
    }

    const newItem = {
      _id: new mongoose.Types.ObjectId(), 
      name: item.name,
      resolved: false, 
    };

    shoppingList.items.push(newItem);
    await shoppingList.save();

    res.status(201).json(newItem);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};


const removeItemFromList = async (req, res) => {
  const { listId } = req.params;
  const { itemId } = req.body;

  try {
    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ msg: "Shopping list not found" });
    }

    if (shoppingList.archived) {
      return res
        .status(400)
        .json({ msg: "Cannot remove items from an archived list" });
    }

    shoppingList.items = shoppingList.items.filter(
      (item) => item._id.toString() !== itemId
    );
    await shoppingList.save();

    res.json(shoppingList);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

const resolveItem = async (req, res) => {
  const { listId } = req.params;
  const { itemId } = req.body;

  try {
    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ msg: "Shopping list not found" });
    }

    const item = shoppingList.items.id(itemId);

    if (!item) {
      return res
        .status(404)
        .json({ msg: "Item not found in the shopping list" });
    }

    item.resolved = !item.resolved;
    await shoppingList.save();

    res.json({
      msg: `Item ${item.resolved ? "resolved" : "unresolved"} successfully`,
      shoppingList,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const archiveList = async (req, res) => {
  const { listId } = req.params;

  try {
    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ msg: "Shopping list not found" });
    }

    if (shoppingList.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ msg: "Only the owner can archive this list" });
    }

    shoppingList.archived = true;
    await shoppingList.save();

    res.json({ msg: "Shopping list archived successfully", shoppingList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteList = async (req, res) => {
  const { listId } = req.params;

  try {
    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ msg: "Shopping list not found" });
    }

    if (shoppingList.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ msg: "Only the owner can delete this list" });
    }

    await ShoppingList.findByIdAndDelete(listId);

    const user = await User.findById(req.user._id);
    user.createdLists = user.createdLists.filter(
      (listIdRef) => listIdRef.toString() !== listId
    );
    await user.save();

    await User.updateMany(
      { _id: { $in: shoppingList.sharedWith } },
      { $pull: { sharedLists: listId } }
    );

    res.json({ msg: "Shopping list deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createList,
  getListById,
  getUserShoppingLists,
  renameList,
  addItemToList,
  removeItemFromList,
  resolveItem,
  archiveList,
  deleteList,
};
