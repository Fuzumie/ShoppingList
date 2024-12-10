const Joi = require('joi');

// Validation schema for creating a list
const createListSchema = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": "Name must be a string.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 50 characters.",
    "any.required": "Name is required.",
  }),
  sharedWith: Joi.array()
    .optional(),
});

// Validation schema for renaming a list
const renameListSchema = Joi.object({
  name: Joi.string().min(3).max(35).required().messages({
    "string.base": "Name must be a string.",
    "string.min": "Name must be at least 3 characters long.",
    "string.max": "Name cannot exceed 35 characters.",
    "any.required": "Name is required.",
  }),
});

// Validation schema for adding an item
const addItemSchema = Joi.object({
  item: Joi.object({
    name: Joi.string().min(1).required().messages({
      "string.base": "Item name must be a string.",
      "string.min": "Item name must be at least 1 character long.",
      "any.required": "Item name is required.",
    }),
    resolved: Joi.boolean().optional(),
  }).required(),
});

// Validation schema for removing an item
const removeItemSchema = Joi.object({
  itemId: Joi.string().pattern(/^[a-fA-F0-9]{24}$/, 'valid ObjectId').required().messages({
    "string.pattern.base": "itemId must be a valid ObjectId.",
    "any.required": "itemId is required.",
  }),
});

// Validation schema for resolving an item
const resolveItemSchema = Joi.object({
  itemId: Joi.string().pattern(/^[a-fA-F0-9]{24}$/, 'valid ObjectId').required().messages({
    "string.pattern.base": "itemId must be a valid ObjectId.",
    "any.required": "itemId is required.",
  }),
});

// Validation schema for retrieving a list by ID
const getListByIdSchema = Joi.object({
  listId: Joi.string().pattern(/^[a-fA-F0-9]{24}$/, 'valid ObjectId').required().messages({
    "string.pattern.base": "listId must be a valid ObjectId.",
    "any.required": "listId is required.",
  }),
});

// Validation schema for archiving or deleting a list
const archiveOrDeleteListSchema = Joi.object({
  listId: Joi.string().pattern(/^[a-fA-F0-9]{24}$/, 'valid ObjectId').required().messages({
    "string.pattern.base": "listId must be a valid ObjectId.",
    "any.required": "listId is required.",
  }),
});

module.exports = {
  createListSchema,
  renameListSchema,
  addItemSchema,
  removeItemSchema,
  resolveItemSchema,
  getListByIdSchema,
  archiveOrDeleteListSchema,
};
