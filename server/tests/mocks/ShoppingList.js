const ShoppingList = {
  find: jest.fn(), 
  findById: jest.fn(), 
  findByIdAndDelete: jest.fn(), 
  create: jest.fn(), 
  prototype: {
    save: jest.fn(), 
  },
};

ShoppingList.findById.mockImplementation((id) => ({
  populate: jest.fn().mockReturnThis(), 
}));

ShoppingList.find.mockImplementation(() => ({
  populate: jest.fn().mockReturnThis(), 
}));

module.exports = ShoppingList;
