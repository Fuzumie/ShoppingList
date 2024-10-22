const express = require('express');
const router = express.Router();
const {
    createList, getListById, getAllListsForUser, renameList, addItemToList,
    removeItemFromList, deleteList, archiveList, resolveItem
} = require('../controllers/shoppingListController');
const requireAuth = require('../middleware/requireAuth');  


// Create a new shopping list
router.post('/create', requireAuth, createList);

// Get a specific shopping list by ID
router.get('/:listId', requireAuth, getListById);

// Get all shopping lists for the logged-in user (owned and shared, non-archived)
router.get('/getAll', requireAuth, getAllListsForUser);

// Update a shopping list (only the owner can rename, everyone can update items)
router.put('/:listId', requireAuth, renameList);

// Add an item to a shopping list (everyone can do this)
router.post('/:listId/items', requireAuth, addItemToList);

// Remove an item from a shopping list (everyone can do this)
router.delete('/:listId/items', requireAuth, removeItemFromList);

// Resolve an item in a shopping list (everyone can do this)
router.put('/:listId/items/resolve', requireAuth, resolveItem); // New route for resolving an item

// Archive a shopping list (only the owner can do this)
router.put('/:listId/archive', requireAuth, archiveList);

// Delete a shopping list (only the owner can do this)
router.delete('/:listId', requireAuth, deleteList);

module.exports = router;