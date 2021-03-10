/* eslint-disable */
import { React, useState } from "react";
import '../style/main.css';
import actions from '../redux/actions';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { useGoogleLogout } from 'react-google-login';
import axios from "axios";

const Cart = () => {

  const dispatch = useDispatch();
  var state = useSelector(state => state);
  const history = useHistory();
  const [rdata, setrdata] = useState([]);
  const [rtotal, setrtotal] = useState(0);

  var viewShop = (event) => {
    history.push('/shopping');
  }

  var requestService = async (event) => {

    axios.post("https://wellcart.herokuapp.com/orderid", {total:total}, {
      "Content-Type": "application/json"
    })
      .then(res =>{
        if (res.data.success === "True") {
      
          var options = {
            "key_id": 'rzp_test_bzgTd4jsuYIdov',
            "amount": total,
            "currency": "INR",
            "name": state.name,
            "order_id": res.data.data.id,
            "handler": function (response) {
              axios.post("https://wellcart.herokuapp.com/request", { 
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                state: JSON.stringify(state)
              }, {
                "Content-Type": "application/json"
              })
              .then(ans=>{
                if (res.data.success === "True") {
                  alert("Payment Successful. Check your email");
                }
                else{
                  alert("Payment not Successful");
                }
              })
            },
            "prefill": {
              "name": "Prithwiraj Samanta",
              "email": "prskid1000@gmail.com",
              "contact": "6204570243"
            },
            "theme": {
              "color": "#3399cc"
            }
          };

          var rzp1 = new Razorpay(options);
          rzp1.open();
          rzp1.on('payment.failed', function (response) {
            alert("Payment Failed! Try after sometime");
          });

          console.log(options);
        }
        else
        {
          alert("Could not Send request");
        }
      });
  }


  const onLogoutSuccess = (res) => {
    history.push('/index');
    //console.log('Logged out Success');
    //alert('Logged out Successfully ✌');
  };

  const onFailure = () => {
    //console.log('Handle failure cases');
  };

  const { signOut } = useGoogleLogout({
    clientId: '276593425300-9gr4rrto1v5411tnnc4r128bf7c6u1sv.apps.googleusercontent.com',
    onLogoutSuccess,
    onFailure,
  });

  var deleteCartItem = (event) => {

    var data = {
      userid: state.email,
      item: state.cart[parseInt(event.target.id)]
    }
    
    axios.post("https://wellcart.herokuapp.com/deletecartitem", data, {
      "Content-Type": "application/json"
    })
      .then(res => {
        if (res.data.success === "True") {
          actions.deleteCartItem.payload.cart = state.cart;
          actions.deleteCartItem.payload.idx = parseInt(event.target.id);
          dispatch(actions.deleteCartItem);
          createtable();
          setrdata(tdata);
          setrtotal(total);
        }
      });

    }

  var tdata = [];
  var total = 0;
  var createtable = () => {
    tdata = [];
    total = 0;
    var set = [];
    for(var i of state.items)
    {
      set[i['id']] = i;
    }

    var j = 0
    for(var i of state.cart)
    {
      tdata.push(
        <tr>
          <td>{set[i].name}</td>
          <td>{set[i].description}</td>
          <td>{'\u20B9'}{set[i].price}</td>
          <td><i id={j++} className="material-icons icon-black clickable" onClick={deleteCartItem}>delete</i></td>
        </tr>
      );
      total += parseInt(set[i].price);
    }
  }

  return (
    <div>
      <nav className="grey darken-4">
        <div className="nav-wrapper m-5">
          <i className="material-icons brand-logo hide-on-small-only clickable">store</i>
          <i className="material-icons brand-logo  left hide-on-med-and-up clickable">store</i>
          <ul className="right">
            <li>Hi,{state.name}</li>
            <li><i className="material-icons clickable p-1" onClick={viewShop}>shop</i></li>
            <li><i className="material-icons clickable p-1" onClick={signOut}>logout</i></li>
          </ul>
        </div>
      </nav>
      <div className="container hide-on-small-only">
        <div className="row m-5"></div>
        <div><h1>Cart</h1></div>
        <table className="highlight centered responsive-table">
          <thead className="grey darken-4 white-text">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
            {createtable()}
            {tdata}
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th className="grey darken-4 white-text">Total: {'\u20B9'}{total}</th>
            </tr>
            <tr><th></th></tr>
            <tr>
              <th></th>
              <th></th>
              <th></th>
              <th>
                <center>
                  <button className="btn waves-effect waves-light grey darken-4 white-text col-12" onClick={requestService}>Pay
                    <i className="material-icons right">payment</i>
                  </button>
                </center>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="container hide-on-med-and-up">
        <div className="row m-5"></div>
        <div><h1>Cart</h1></div>
        <table className="highlight centered responsive-table">
          <thead className="grey darken-4 white-text">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Option</th>
            </tr>
          </thead>
          <tbody>
            {createtable()}
            {tdata}
          </tbody>
        </table>
        <div className="col hide-on-med-and-up">
          <div className="row-12">
            <div className="grey darken-4 white-text p-1 h5">Total: {'\u20B9'}{total}</div>
          </div>
          <div className="row-12 mt-3">
            <button className="btn waves-effect waves-light grey darken-4 white-text pb-1 right" onClick={requestService}>Pay
                    <i className="material-icons right">payment</i>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Cart;
