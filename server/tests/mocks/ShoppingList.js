const ShoppingList = {
    find: jest.fn(), // Mock the `find` method
    findById: jest.fn(), // Mock the `findById` method
    findByIdAndDelete: jest.fn(), // Mock the `findByIdAndDelete` method
    create: jest.fn(), // Mock `create` if used to add new lists
    prototype: {
      save: jest.fn(), // Mock the `save` method for instances
    },
  };
  
  module.exports = ShoppingList;
  