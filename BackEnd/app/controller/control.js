var nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'wellcartstore@gmail.com',
        pass: 'WellCart'
    }
});

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

exports.Request = (req, res, next) => {

    console.log(req.body);

    let message = (
        `<h4><b>These are the items requested:<b></h4>
        <table>
         <thead>
            <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
            </tr>
         </thead >`
    ); 

    var total = 0;
    var set = [];
    for(var i of req.body.items) {
        set[i['id']] = i;
    }

    for (var i of req.body.cart) {
        message = message + 
            '<tr>' + 
                `<td>` + set[i].name + `</td>` + 
                `<td>` + set[i].description + `</td>` + 
                `<td>` + `'\u20B9'` + set[i].price + `</td>` + 
            `</tr>`
        total += parseInt(set[i].price);
    }

    message += `</table><b><p>Total amount to be paid is `  + `'\u20B9'`+ total + `</p><p>You will be contacted soon by me.</p><p>Prithwiraj Samanta</p></b>`;

    var mailOptions1 = {
        from: 'prskid1000@gmail.com',
        to: req.body.email,
        subject: 'Request for Services',
        html: message
    };

    var mailOptions2 = {
        from: 'prskid1000@gmail.com',
        to: 'prskid1000@gmail.com',
        subject: 'Request for Services',
        html: message
    };
    
  
    transporter.sendMail(mailOptions1, function (error, info) {
        if (error) {
            res.json({ success: 'False', data: "Error-1 in sending email" });
        } else {
            console.log('Email sent: ' + info.response);
            transporter.sendMail(mailOptions2, function (error, info) {
                if (error) {
                    res.json({ success: 'False', data: "Error-2 in sending email" });
                } else {
                    console.log('Email sent: ' + info.response);
                    res.json({ success: 'True', data: "Email Sent" });
                }
            });
        }
    }); 
}

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
    console.log(req);
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


