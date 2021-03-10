var md5 = require('md5');
var nodemailer = require('nodemailer');
const Razorpay = require("razorpay");
const crypto = require("crypto");
var instance = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.guser,
        pass: process.env.gpass
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

exports.orderId = async (req, res, next) => {
    var hash = md5(Date.now())
    console.log(req.body.total);
    req.body.total = req.body.total * 100;
    const order = await instance.orders.create({
        'amount': req.body.total,
        'currency': "INR",
        'receipt': hash }).catch(err => {
            console.log(err);
        })

    res.json({ success: 'True', data: order });
}

exports.Request = (req, res, next) => {

    //console.log(req.body);
    const hmac = crypto.createHmac('sha256', process.env.key_secret);
    hmac.update(req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id);
    var generated_signature = hmac.digest('hex');
    if (generated_signature == req.body.razorpay_signature) 
    { 
        console.log("Success");
        req.body.state = JSON.parse(req.body.state);

        let message = (
            `<h4><b>These are the items you ordered:<b></h4>
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
        for (var i of req.body.state.items) {
            set[i['id']] = i;
        }

        for (var i of req.body.state.cart) {
            message = message +
                '<tr>' +
                `<td>` + set[i].name + `</td>` +
                `<td>` + set[i].description + `</td>` +
                `<td>` + `'\u20B9'` + set[i].price + `</td>` +
                `</tr>`
            total += parseInt(set[i].price);
        }

        message += `</table><b><p>Total amount paid is ` + `'\u20B9'` + total + `</p><p>Thank You for supporting me.</p><p>Prithwiraj Samanta</p></b>`;

        var mailOptions1 = {
            from: 'prskid1000@gmail.com',
            to: req.body.state.email,
            subject: 'Order Details',
            html: message
        };

        var mailOptions2 = {
            from: 'prskid1000@gmail.com',
            to: 'prskid1000@gmail.com',
            subject: 'Order Details',
            html: message
        };  

        transporter.sendMail(mailOptions1, function (error, info) {
            if (error) {
                console.log(error);
                res.json({ success: 'False', data: "Error-1 in sending email" });
            } else {
                console.log('Email sent: ' + info.response);
                transporter.sendMail(mailOptions2, function (error, info) {
                    if (error) {
                        console.log(error);
                        res.json({ success: 'False', data: "Error-2 in sending email" });
                    } else {
                        console.log('Email sent: ' + info.response);
                        res.json({ success: 'True', data: "Email Sent" });
                    }
                });
            }
        });
    }
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


