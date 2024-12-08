const express = require('express');
const router = express.Router();
const validate = require('../middleware/validate');
const requireAuth = require('../middleware/requireAuth');
const {
  createListSchema,
  renameListSchema,
  addItemSchema,
  removeItemSchema,
  resolveItemSchema,
  archiveOrDeleteListSchema,
} = require('../validation/shoppingListValidation');
const {
    createList,
    getListById,
    getUserShoppingLists,
    renameList,
    addItemToList,
    removeItemFromList,
    deleteList,
    archiveList,
    resolveItem
} = require('../controllers/shoppingListController');



// Create a new shopping list
router.post('/create', requireAuth, validate(createListSchema), createList);

// Get a specific shopping list by ID
router.get('/:listId', requireAuth, validate(archiveOrDeleteListSchema),getListById);

// Get all shopping lists for the logged-in user (owned and shared, non-archived)
router.get('/', requireAuth, getUserShoppingLists);

// Update a shopping list (only the owner can rename, everyone can update items)
router.put('/:listId', requireAuth, validate(renameListSchema),renameList);

// Add an item to a shopping list (everyone can do this)
router.post('/:listId/items', requireAuth, validate(addItemSchema),addItemToList);

// Remove an item from a shopping list (everyone can do this)
router.delete('/:listId/items', requireAuth, validate(removeItemSchema),removeItemFromList);

// Resolve an item in a shopping list (everyone can do this)
router.put('/:listId/items/resolve', requireAuth, validate(resolveItemSchema),resolveItem); 

// Archive a shopping list (only the owner can do this)
router.put('/:listId/archive', requireAuth, archiveList);

// Delete a shopping list (only the owner can do this)
router.delete('/:listId', requireAuth, deleteList);

module.exports = router;