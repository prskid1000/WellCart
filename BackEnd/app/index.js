var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://prskid1000:nIELmPiB3vZ4YkWQ@cluster0-qxsqv.mongodb.net/wellcart?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB Connection Error'));
db.on('open', console.error.bind(console, 'MongoDB Connected Succesfully'));

var express = require('express');
var multer = require('multer');

var cors = require('cors');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var app = express();
var upload = multer();

app.use(cors({ origin: true }));
app.use(upload.array('files', 12));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

const control = require('./controller/control');

app.post('/getcart', control.getCart);
app.post('/createcart', control.createCart);
app.post('/deletecartitem', control.deleteCartItem);
app.post('/addcartitem', control.addCartItem);

app.post('/additem', control.addItem);
app.post('/removeitem', control.removeItem);
app.get('/getitems', control.getItems);

app.listen(process.env.PORT || 3001,
    () => console.log("Server is running..."));
console.log('CE BackEnd');
