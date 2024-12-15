const User = {
    find: jest.fn(), 
    findById: jest.fn(), 
    findByIdAndUpdate: jest.fn(), 
    updateMany: jest.fn(), 
    create: jest.fn(), 
    prototype: {
      save: jest.fn(), 
    },
  };

  User.findById.mockImplementation((id) => ({
    _id: id,
    createdLists: [
      { name: "Groceries", sharedWith: [{ name: "John", surname: "Doe" }] },
    ],
    sharedLists: [
      { name: "Electronics", sharedWith: [{ name: "Alice", surname: "Smith" }] },
    ],
    populate: jest.fn().mockReturnThis(), 
  }));
  
  
  module.exports = User;
  