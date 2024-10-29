const mongoose = require('mongoose');

const ShoppingListSchema = mongoose.Schema({
    
    name: {
        type: String,
        required: true 
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true 
    },
    archived: {
        type: Boolean,
        default: false 
    },
    items: [{
      name: { type: String, required: false },
      resolved: { type: Boolean, default: false }
    }],
    sharedWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const ShoppingList = mongoose.model('ShoppingList', ShoppingListSchema);


module.exports = ShoppingList;