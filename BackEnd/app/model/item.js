var mongoose = require('mongoose');
var ItemSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        trim: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    price: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },
    
});

var Item = mongoose.model('Item', ItemSchema);
module.exports = Item;
 
