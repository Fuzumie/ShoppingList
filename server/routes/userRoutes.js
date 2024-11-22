const express = require('express');
const router = express.Router();
const { signup, login, inviteUserToList, getListMembers, removeUserFromList} = require('../controllers/userController');
const requireAuth = require( '../middleware/requireAuth');


// Register a new user
router.post('/register', signup);

//router.get('/get', requireAuth, getUser);

// Login an existing user
router.post('/login', login);

// Invite a user to a shopping list
router.post('/invite', requireAuth, inviteUserToList);

// Get members (including owner) of a specific shopping list
router.get('/list/:listId/members', requireAuth, getListMembers);

// Remove a user from a shopping list
router.post('/list/remove-user', requireAuth, removeUserFromList);

module.exports = router;
