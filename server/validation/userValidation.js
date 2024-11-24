const Joi = require('joi');

// Validation schema for signup
const signupSchema = Joi.object({
  name: Joi.string().min(2).max(15).required().messages({
    "string.base": "Name must be a string.",
    "string.min": "Name must be at least 2 characters long.",
    "string.max": "Name cannot exceed 50 characters.",
    "any.required": "Name is required.",
  }),
  surname: Joi.string().min(2).max(15).required().messages({
    "string.base": "Surname must be a string.",
    "string.min": "Surname must be at least 2 characters long.",
    "string.max": "Surname cannot exceed 50 characters.",
    "any.required": "Surname is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "A valid email is required.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "Password is required.",
  }),
});

// Validation schema for login
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "A valid email is required.",
    "any.required": "Email is required.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters long.",
    "any.required": "Password is required.",
  }),
});

// Validation schema for inviting a user to a list
const inviteUserSchema = Joi.object({
  userId: Joi.string().pattern(/^[a-fA-F0-9]{24}$/, 'valid ObjectId').required().messages({
    "string.pattern.base": "userId must be a valid ObjectId.",
    "any.required": "userId is required.",
  }),
});

// Validation schema for removing a user from a list
const removeUserSchema = Joi.object({
  userIdToRemove: Joi.string().pattern(/^[a-fA-F0-9]{24}$/, 'valid ObjectId').required().messages({
    "string.pattern.base": "userIdToRemove must be a valid ObjectId.",
    "any.required": "userIdToRemove is required.",
  }),
});

// Validation schema for getting members of a list
const getListMembersSchema = Joi.object({
  listId: Joi.string().pattern(/^[a-fA-F0-9]{24}$/, 'valid ObjectId').required().messages({
    "string.pattern.base": "listId must be a valid ObjectId.",
    "any.required": "listId is required.",
  }),
});

module.exports = {
  signupSchema,
  loginSchema,
  inviteUserSchema,
  removeUserSchema,
  getListMembersSchema,
};
