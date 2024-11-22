const User = require('../models/userModel')
const ShoppingList = require('../models/shoppingListModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '3d' })
}

const login = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.login(email, password)
    const token = createToken(user._id)
    const id=user._id
    res.status(200).json({email, token, id})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

const signup = async (req, res) => {
  const {name, surname, email, password} = req.body

  try {
    const user = await User.signup(name, surname, email, password)
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}



const inviteUserToList = async (req, res) => {
    const { listId, invitedEmail } = req.body;
  
    try {
      // Find the user being invited by email
      const invitedUser = await User.findOne({ email: invitedEmail });
      if (!invitedUser) {
        return res.status(404).json({ msg: 'Invited user not found' });
      }
  
      // Find the shopping list and check ownership
      const shoppingList = await ShoppingList.findById(listId);
      if (!shoppingList) {
        return res.status(404).json({ msg: 'Shopping list not found' });
      }
  
      // Ensure the current user is the owner of the list
      if (shoppingList.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: 'You are not the owner of this list' });
      }
      
      // Add the invited user to the sharedWith array if they are not already invited
      if (shoppingList.sharedWith.includes(invitedUser._id)) {
        return res.status(400).json({ msg: 'User is already invited' });
      }
  
      shoppingList.sharedWith.push(invitedUser._id);
      await shoppingList.save();
  
      // Update the invited user's shared lists
      invitedUser.sharedLists.push(shoppingList._id);
      await invitedUser.save();
  
      res.json({ msg: 'User invited successfully' });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).json({ error: error.message });
    }
  };

const getListMembers = async (req, res) => {
    const { listId } = req.params;
  
    try {
      const shoppingList = await ShoppingList.findById(listId).populate('owner').populate('sharedWith');
      
      if (!shoppingList) {
        return res.status(404).json({ msg: 'Shopping list not found' });
      }

      const owner = shoppingList.owner;
      const members = shoppingList.sharedWith;
  
      const result = {
        owner: {
          name: owner.name,
          surname:owner.surname
        },
        members: members.map(member => ({
          name: member.name,
          surname: member.surname
        }))
      };
  
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

const removeUserFromList = async (req, res) => {
    const { listId, userIdToRemove } = req.body;  
  
    try {
      const shoppingList = await ShoppingList.findById(listId);
  
      if (!shoppingList) {
        return res.status(404).json({ msg: 'Shopping list not found' });
      }
  
      // Ensure the current user is the owner of the list
      if (shoppingList.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ msg: 'You are not the owner of this list' });
      }
  
      // Ensure the user being removed is in the sharedWith array
      if (!shoppingList.sharedWith.includes(userIdToRemove)) {
        return res.status(400).json({ msg: 'User is not part of this list' });
      }
  
      // Remove the user from the sharedWith array
      shoppingList.sharedWith = shoppingList.sharedWith.filter(
        userId => userId.toString() !== userIdToRemove
      );
  
      // Save the updated list
      await shoppingList.save();
  
      // Remove the list from the removed user's sharedLists array
      const userToRemove = await User.findById(userIdToRemove);
      if (userToRemove) {
        userToRemove.sharedLists = userToRemove.sharedLists.filter(
          listIdRef => listIdRef.toString() !== listId
        );
        await userToRemove.save();
      }
  
      res.json({ msg: 'User removed from the list successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


module.exports = { signup, login, inviteUserToList, getListMembers, removeUserFromList, getUser }