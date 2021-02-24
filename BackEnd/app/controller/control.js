exports.getCart = (req, res, next) => {
    var Model = require('../model/cart');
    Model.findOne({ userid: req.body.userid }, function (err, docs) {
        if (err || !docs) {
            res.json({ success: 'False'});
        } else {
            res.json({ success: 'True', data: docs });
        }
    });
};

exports.getItems = (req, res, next) => {
    var Model = require('../model/item');
    Model.find({ }, function (err, docs) {
        if (err || !docs) {
            res.json({ success: 'False' });
        } else {
            res.json({ success: 'True', data: docs });
        }
    });
};

exports.createCart = (req, res, next) => {
    var Model = require('../model/cart');
    var model = new Model({ userid: req.body.userid, cart: []});
    model.save()
        .then(doc => {
            res.json({ success: 'True', data: doc });
        })
        .catch(err => {
            res.json({ success: 'False', data: err });
        });
};

exports.addItem = (req, res, next) => {
    var Model = require('../model/item');
    var model = new Model({ 
        id: req.body.id, 
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
     });
    model.save()
        .then(doc => {
            res.json({ success: 'True', data: doc });
        })
        .catch(err => {
            res.json({ success: 'False', data: err });
        });
};

exports.removeItem = (req, res, next) => {
    var Model = require('../model/item');
    Model.deleteMany({ id: req.body.id }, function (err, docs) {
        if (err || !docs) {
            console.log("Error in deleting");
            res.json({ success: 'False', data: "Error in Deleting" });
        } else {
            console.log("Item deleted");
            res.json({ success: 'True', data: "Deleted Successfully" });
        }
    });
};

exports.addCartItem = (req, res, next) => {
    var Model = require('../model/cart');
    Model.findOne({ userid: req.body.userid }, function (err, cart) {
        if (err || !cart) {
            res.json({ success: 'False', data: 'No Post Found' });
        } else {
            Model.deleteMany({ userid: req.body.userid }, function (err, docs) {
                console.log(cart);
                if (err || !docs) {
                    console.log("Error in Updating Cart");
                    res.json({ success: 'False', data: "Error in Updating Cart" });
                } else {
                    var model = new Model({ userid: req.body.userid, cart: cart.cart });
                    model.cart.push(req.body.item);
                    model.save()
                        .then(doc => {
                            console.log("Cart Updated");
                            res.json({ success: 'True', data: doc });
                        })
                        .catch(err => {
                            console.log("Error in Updating Cart");
                            res.json({ success: 'False', data: "Error in Updating Cart" });
                        });
                }
            });
        }
    });
};

exports.deleteCartItem = (req, res, next) => {
    var Model = require('../model/cart');
    Model.findOne({ userid: req.body.userid }, function (err, cart) {
        if (err || !cart) {
            res.json({ success: 'False', data: 'No Post Found' });
        } else {
            Model.deleteMany({ userid: req.body.userid }, function (err, docs) {
                if (err || !docs) {
                    console.log("Error in Updating Cart");
                    res.json({ success: 'False', data: "Error in Updating Cart" });
                } else {
                    var model = new Model({ userid: cart.userid, cart: [] });
                    for (var i = 0; i < cart.cart.length; i++) {
                        if (cart.cart[i] != req.body.item)
                            model.cart.push(cart.cart[i]);
                    }
                    model.save()
                        .then(doc => {
                            console.log("Cart Updated");
                            res.json({ success: 'True', data: doc });
                        })
                        .catch(err => {
                            console.log("Error in Updating Cart");
                            res.json({ success: 'False', data: "Error in Updating Cart" });
                        });
                }
            });
        }
    });
};


