const User = {
    find: jest.fn(), // Mock the `find` method
    findById: jest.fn(), // Mock the `findById` method
    findByIdAndUpdate: jest.fn(), // Mock the `findByIdAndUpdate` method
    updateMany: jest.fn(), // Mock the `updateMany` method
    create: jest.fn(), // Mock `create` if new users are created
    prototype: {
      save: jest.fn(), // Mock the `save` method for instances
    },
  };
  
  module.exports = User;
  