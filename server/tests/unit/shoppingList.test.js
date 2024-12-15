const {
  createList,
  getListById,
  getUserShoppingLists,
  renameList,
  deleteList,
} = require("../../controllers/shoppingListController");
const User = require("../../models/userModel");
const ShoppingList = require("../../models/shoppingListModel");

jest.mock("../../models/userModel");
jest.mock("../../models/shoppingListModel");

describe("Shopping List Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    ShoppingList.findById.mockImplementation((id) => ({
      populate: jest.fn().mockImplementation((path, select) => ({
        populate: jest.fn().mockResolvedValue({
          _id: id,
          name: "Groceries",
          owner: { name: "Test", surname: "User", email: "test@example.com" },
          sharedWith: [
            { name: "John", surname: "Doe", email: "john@example.com" },
          ],
        }),
      })),
    }));

    User.findById.mockImplementation((id) => ({
      populate: jest.fn().mockImplementation(({ path, select, populate }) => ({
        populate: jest.fn().mockResolvedValue({
          _id: id,
          createdLists: [{
            name: "Groceries",
            archived: false,
            owner: { name: "Test", surname: "User" },
            sharedWith: [{ name: "John", surname: "Doe" }],
          }],
          sharedLists: [{
            name: "Office Supplies",
            archived: false,
            owner: { name: "Test", surname: "User" },
            sharedWith: [{ name: "John", surname: "Doe" }],
          }],
        }),
      })),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createList", () => {
    it("should create a shopping list and return it", async () => {
      const req = {
        body: { name: "Groceries", sharedWith: ["userId2"] },
        user: { _id: "userId1" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.find.mockResolvedValue([
        { _id: "userId2", sharedLists: [], save: jest.fn() },
      ]);

      User.findById.mockResolvedValue({
        _id: "userId1",
        createdLists: [],
        save: jest.fn(),
      });

      ShoppingList.prototype.save = jest.fn().mockResolvedValue({
        _id: "listId",
        name: "Groceries",
        owner: "userId1",
        sharedWith: ["userId2"],
      });

      ShoppingList.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementation(() => ({
          populate: jest.fn().mockResolvedValue({
            _id: "listId",
            name: "Groceries",
            owner: { name: "John", surname: "Doe" },
            sharedWith: [{ name: "Jane", surname: "Smith" }],
          }),
        })),
      }));

      await createList(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Groceries",
          owner: expect.objectContaining({ name: "John" }),
          sharedWith: expect.any(Array),
        })
      );

      expect(User.findById).toHaveBeenCalledWith("userId1");
      expect(User.find).toHaveBeenCalledWith({ _id: { $in: ["userId2"] } });
      expect(ShoppingList.prototype.save).toHaveBeenCalled();
    });

    it("should return 400 if some sharedWith users do not exist", async () => {
      const req = {
        body: { name: "Groceries", sharedWith: ["invalidUserId"] },
        user: { _id: "userId1" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.find.mockResolvedValue([]);

      await createList(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Some users in sharedWith do not exist",
      });
    });

    it("should return 404 if the owner user is not found", async () => {
      const req = {
        body: { name: "Groceries", sharedWith: [] },
        user: { _id: "userId1" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      User.find.mockResolvedValue([]);
      User.findById.mockResolvedValue(null);

      await createList(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Owner user not found" });
    });
  });

  describe("getListById", () => {
    it("should return a shopping list by ID", async () => {
      ShoppingList.findById.mockResolvedValueOnce({
        _id: "listId",
        name: "Groceries",
        owner: { name: "Test", surname: "User", email: "test@example.com" },
        sharedWith: [
          { name: "John", surname: "Doe", email: "john@example.com" },
        ],
        populate: jest.fn().mockReturnThis(),  
      });
    
      const req = { params: { listId: "listId" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    
      await getListById(req, res);
    
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Groceries",
          owner: { name: "Test", surname: "User", email: "test@example.com" },
          sharedWith: [
            { name: "John", surname: "Doe", email: "john@example.com" },
          ],
        })
      );
    });
    
  
    it("should return 404 if the shopping list does not exist", async () => {
      ShoppingList.findById.mockImplementation(() => ({
        populate: jest.fn().mockImplementationOnce(() => ({
          populate: jest.fn().mockResolvedValueOnce(null),
        })),
      }));
  
      const req = { params: { listId: "nonexistentId" } };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
      await getListById(req, res);
  
      expect(ShoppingList.findById).toHaveBeenCalledWith("nonexistentId");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "Shopping list not found" });
    });
  });

  describe('getUserShoppingLists', () => {
    it('should return created and shared lists for the user', async () => {
      const req = {
        user: { _id: 'user123' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
  
    
      User.findById.mockResolvedValue({
        _id: 'user123',
        createdLists: ['list123'],
        sharedLists: ['list456'],
        populate: jest.fn().mockReturnThis(),
      });
      ShoppingList.findById.mockResolvedValue({
        _id: 'list123',
        name: 'Groceries',
        sharedWith: [{ name: 'John' }],
      });
  
     
      await getUserShoppingLists(req, res);
  
    
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        createdLists: expect.any(Array),
        sharedLists: expect.any(Array),
      });
    });
  });
  describe("renameList", () => {
    it("should rename a shopping list successfully", async () => {
      const req = {
        params: { listId: "listId" },
        body: { name: "New Name" },
        user: { _id: "userId1" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      ShoppingList.findById.mockResolvedValue({
        _id: "listId",
        name: "Old Name",
        owner: "userId1",
        archived: false,
        save: jest.fn(),
      });

      await renameList(req, res);

      expect(ShoppingList.findById).toHaveBeenCalledWith("listId");
      expect(res.status).not.toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ name: "New Name" })
      );
    });

    it("should return 404 if the shopping list does not exist", async () => {
      const req = {
        params: { listId: "nonexistentId" },
        body: {},
        user: { _id: "userId1" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      ShoppingList.findById.mockResolvedValue(null);

      await renameList(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "Shopping list not found" });
    });

    it("should return 400 if the shopping list is archived", async () => {
      const req = {
        params: { listId: "listId" },
        body: { name: "New Name" },
        user: { _id: "userId1" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      ShoppingList.findById.mockResolvedValue({
        _id: "listId",
        name: "Old Name",
        owner: "userId1",
        archived: true,
        save: jest.fn(),
      });

      await renameList(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Cannot update an archived list",
      });
    });

    it("should return 403 if the requester is not the owner", async () => {
      const req = {
        params: { listId: "listId" },
        body: { name: "New Name" },
        user: { _id: "userId2" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      ShoppingList.findById.mockResolvedValue({
        _id: "listId",
        name: "Old Name",
        owner: "userId1",
        archived: false,
        save: jest.fn(),
      });

      await renameList(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Only the owner can rename this list",
      });
    });
  });

  describe("deleteList", () => {
    it("should delete a shopping list successfully", async () => {
      const req = { params: { listId: "listId" }, user: { _id: "userId1" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      ShoppingList.findById.mockResolvedValue({
        _id: "listId",
        name: "Groceries",
        owner: "userId1",
        sharedWith: ["userId2"],
      });

      User.findById.mockResolvedValue({
        _id: "userId1",
        createdLists: ["listId"],
        save: jest.fn(),
      });

      ShoppingList.findByIdAndDelete.mockResolvedValue();
      User.updateMany.mockResolvedValue();

      await deleteList(req, res);

      expect(ShoppingList.findByIdAndDelete).toHaveBeenCalledWith("listId");
      expect(User.updateMany).toHaveBeenCalledWith(
        { _id: { $in: ["userId2"] } },
        { $pull: { sharedLists: "listId" } }
      );
      expect(res.json).toHaveBeenCalledWith({
        msg: "Shopping list deleted successfully",
      });
    });

    it("should return 404 if the shopping list does not exist", async () => {
      const req = {
        params: { listId: "nonexistentId" },
        user: { _id: "userId1" },
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      ShoppingList.findById.mockResolvedValue(null);

      await deleteList(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ msg: "Shopping list not found" });
    });

    it("should return 403 if the requester is not the owner", async () => {
      const req = { params: { listId: "listId" }, user: { _id: "userId2" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      ShoppingList.findById.mockResolvedValue({
        _id: "listId",
        name: "Groceries",
        owner: "userId1",
        sharedWith: ["userId2"],
      });

      await deleteList(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Only the owner can delete this list",
      });
    });
  });
});
