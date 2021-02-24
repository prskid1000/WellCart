var mongoose = require('mongoose');
var CartSchema = new mongoose.Schema({
    userid: {
        type: String,
        required: true,
        trim: true
    },
    cart: [String]
});

var Cart = mongoose.model('Cart', CartSchema);
module.exports = Cart;
 
