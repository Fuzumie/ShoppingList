const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const requireAuth = require( '../middleware/requireAuth');
const {
  signupSchema,
  loginSchema,
  inviteUserSchema,
  removeUserSchema,
  getListMembersSchema,
} = require('../validation/userValidation');
const {
    signup,
    login,
    inviteUserToList,
    getListMembers,
    removeUserFromList,
    getAllUsers
}= require('../controllers/userController');



// Register a new user
router.post('/register', validate(signupSchema), signup);

// Login an existing user
router.post('/login', validate(loginSchema), login);

// Get all existing users
router.get("/get", requireAuth, getAllUsers); 

// Invite a user to a shopping list
router.post('/:listId/invite', requireAuth, validate(inviteUserSchema), inviteUserToList);

// Get members (including owner) of a specific shopping list
router.get('/:listId/members', requireAuth, validate(getListMembersSchema), getListMembers);

// Remove a user from a shopping list
router.post('/:listId/remove', requireAuth, validate(removeUserSchema), removeUserFromList);

module.exports = router;
