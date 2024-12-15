const User = require("../models/userModel");
const ShoppingList = require("../models/shoppingListModel");
const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    const id = user._id;
    res.status(200).json({ email, token, id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signup = async (req, res, next) => {
  const { name, surname, email, password } = req.body;

  try {
    
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("This email is already in use. Please use a different email.");
      error.statusCode = 400;  
      return next(error); 
    }

    const user = await User.signup(name, surname, email, password);
    const token = createToken(user._id);

    res.status(200).json({ email, token });

  } catch (error) {
    next(error); 
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users); 
  } catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};


const inviteUserToList = async (req, res) => {
  const { listId } = req.params;
  const { userId } = req.body;

  try {
    const invitedUser = await User.findById(userId);
    if (!invitedUser) {
      return res.status(404).json({ msg: "Invited user not found" });
    }

    const shoppingList = await ShoppingList.findById(listId);
    if (!shoppingList) {
      return res.status(404).json({ msg: "Shopping list not found" });
    }

    if (shoppingList.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ msg: "You are not the owner of this list" });
    }

    if (shoppingList.sharedWith.includes(invitedUser._id)) {
      return res.status(400).json({ msg: "User is already invited" });
    }

    // Add the user to the shared list
    shoppingList.sharedWith.push(invitedUser._id);
    await shoppingList.save();

    // Add the list reference to the user's shared lists
    invitedUser.sharedLists.push(shoppingList._id);
    await invitedUser.save();

    // Return only user information
    res.json({
      msg: "User invited successfully",
      user: { id: invitedUser._id, name: invitedUser.name},
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: error.message });
  }
};


const getListMembers = async (req, res) => {
  const { listId } = req.params;

  try {
    const shoppingList = await ShoppingList.findById(listId)
      .populate("owner")
      .populate("sharedWith");

    if (!shoppingList) {
      return res.status(404).json({ msg: "Shopping list not found" });
    }

    const owner = shoppingList.owner;
    const members = shoppingList.sharedWith;

    const result = {
      owner: {
        _id: owner._id,        
        name: owner.name,
        surname: owner.surname,
      },
      members: members.map((member) => ({
        _id: member._id,    
        name: member.name,
        surname: member.surname,
      })),
    };

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


const removeUserFromList = async (req, res) => {
  const { listId } = req.params;
  const { userIdToRemove } = req.body;

  try {
    const shoppingList = await ShoppingList.findById(listId);

    if (!shoppingList) {
      return res.status(404).json({ msg: "Shopping list not found" });
    }

    if (shoppingList.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ msg: "You are not the owner of this list" });
    }

    if (!shoppingList.sharedWith.includes(userIdToRemove)) {
      return res.status(400).json({ msg: "User is not part of this list" });
    }

    shoppingList.sharedWith = shoppingList.sharedWith.filter(
      (userId) => userId.toString() !== userIdToRemove
    );

    await shoppingList.save();

    const userToRemove = await User.findById(userIdToRemove);
    if (userToRemove) {
      userToRemove.sharedLists = userToRemove.sharedLists.filter(
        (listIdRef) => listIdRef.toString() !== listId
      );
      await userToRemove.save();
    }

    res.status(200).json({ 
      msg: "User removed from the list successfully", 
      shoppingList 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signup,
  login,
  inviteUserToList,
  getListMembers,
  removeUserFromList,
  getAllUsers
};
