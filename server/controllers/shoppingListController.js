const ShoppingList = require('../models/shoppingListModel');
const User = require('../models/userModel');

const createList = async (req, res) => {
  const { name, sharedWith } = req.body;
  const currentUser = req.user._id
  try {
    const newList = new ShoppingList({
      name,
      owner: currentUser,
      sharedWith
    });

    await newList.save();

    const user = await User.findById(req.user._id);
    user.createdLists.push(newList._id);
    await user.save();

    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ error: 'Server error', message: error.message });
  }
};

const getListById = async (req, res) => {
  const { listId } = req.params;

  try {
    const shoppingList = await ShoppingList.findById(listId)
      .populate('owner', 'name email')
      .populate('sharedWith', 'name email');

    if (!shoppingList) {
      return res.status(404).json({ msg: 'Shopping list not found' });
    }

    res.json(shoppingList);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};


const getUserShoppingLists = async (req, res) => {
  const userId = req.user._id
  try {
    const user = await User.findById(userId)
      .populate('createdLists', 'name archived')
      .populate('sharedLists', 'name archived');
  
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    res.status(200).json({
      createdLists: user.createdLists,
      sharedLists: user.sharedLists
    });
  } catch (error) {
    console.error('Error occurred:', error.message);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};



const renameList = async (req, res) => {
  const { listId } = req.params;
  const { name } = req.body;

  try {
    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ msg: 'Shopping list not found' });
    }

    if (shoppingList.archived) {
      return res.status(400).json({ msg: 'Cannot update an archived list' });
    }

    if (name && shoppingList.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Only the owner can rename this list' });
    }

    if (name) {
      shoppingList.name = name;
    }

    await shoppingList.save();

    res.json(shoppingList);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const addItemToList = async (req, res) => {
  const { listId } = req.params;
  const { name } = req.body;

  try {
    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ msg: 'Shopping list not found' });
    }

    if (shoppingList.archived) {
      return res.status(400).json({ msg: 'Cannot add items to an archived list' });
    }

    shoppingList.items.push(name);
    await shoppingList.save();

    res.json(shoppingList);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const removeItemFromList = async (req, res) => {
  const { listId } = req.params;
  const { itemId } = req.body;

  try {
    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ msg: 'Shopping list not found' });
    }

    if (shoppingList.archived) {
      return res.status(400).json({ msg: 'Cannot remove items from an archived list' });
    }

    shoppingList.items = shoppingList.items.filter(item => item._id.toString() !== itemId);
    await shoppingList.save();

    res.json(shoppingList);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const resolveItem = async (req, res) => {
    const { listId } = req.params;
    const { itemId } = req.body;
  
    try {
      const shoppingList = await ShoppingList.findById(listId);
  
      if (!shoppingList) {
        return res.status(404).json({ msg: 'Shopping list not found' });
      }
  
      const item = shoppingList.items.id(itemId);
  
      if (!item) {
        return res.status(404).json({ msg: 'Item not found in the shopping list' });
      }
  
      item.resolved = true;
      await shoppingList.save();
  
      res.json(shoppingList);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


const archiveList = async (req, res) => {
  const { listId } = req.params;

  try {
    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ msg: 'Shopping list not found' });
    }

    if (shoppingList.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Only the owner can archive this list' });
    }

    shoppingList.archived = true;
    await shoppingList.save();

    res.json({ msg: 'Shopping list archived successfully', shoppingList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteList = async (req, res) => {
  const { listId } = req.params;

  try {
    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ msg: 'Shopping list not found' });
    }

    if (shoppingList.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ msg: 'Only the owner can delete this list' });
    }

    await ShoppingList.findByIdAndDelete(listId);

    const user = await User.findById(req.user._id);
    user.createdLists = user.createdLists.filter(listIdRef => listIdRef.toString() !== listId);
    await user.save();

    await User.updateMany(
      { _id: { $in: shoppingList.sharedWith } },
      { $pull: { sharedLists: listId } }
    );

    res.json({ msg: 'Shopping list deleted successfully' });
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
    deleteList
}