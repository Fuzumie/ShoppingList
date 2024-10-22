const mongoose = require('mongoose');

const VocabSchema = mongoose.Schema({
    
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
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
});

const Vocabulary = mongoose.model('ShoppingList', VocabSchema);


module.exports = Vocabulary;