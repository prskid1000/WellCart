/* eslint-disable */
import { React, useState } from "react";
import '../style/main.css';
import actions from '../redux/actions';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { useGoogleLogout } from 'react-google-login';
import axios from "axios";

const Shopping = () => {

  const dispatch = useDispatch();
  var state = useSelector(state => state);
  const history = useHistory();
  const [alert, setAlert] = useState("Welcome");

  var viewCart= (event) => {
    history.push('/cart');
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
    clientId: '276593425300-604na80o4eu6n69crv65vubq4a1b3f5t.apps.googleusercontent.com',
    onLogoutSuccess,
    onFailure,
  });

  var card = [];

  var addItem = (event) => {

    actions.addCartItem.payload.item = event.target.id;
    dispatch(actions.addCartItem);

    var data = {
      userid: state.email,
      item: event.target.id
    }
    
    axios.post("https://prskid1000.herokuapp.com/addcartitem", data, {
      "Content-Type": "application/json"
    });
    
    setAlert(event.target.id + " is added to Cart");
  }

  state.items.map((item, index) => {
    {
      card.push(
        <div class="col-4 s12 m6">
          <div class="card">
            <div class="card-image">
              <img src="bag.svg"></img>
            </div>
            <div class="card-content">
              <div class="card-title black-text text-right row">{'\u20B9'}{item.price}</div>
              <span class="card-title black-text col row"><h4>{item.name}</h4></span>
              <p class="black-text col row">{item.description}</p>
              <a class="btn-floating halfway-fab waves-effect waves-light grey darken-4"><i id={item.id} class="material-icons" onClick={addItem}>add</i></a>
            </div>
          </div>
        </div>  
      );
    }
  });

  var alertBack = (event) => {
    setAlert("Welcome");
  }

  return (
    <div>
      <nav className="grey darken-4">
        <div className="nav-wrapper m-5 ">
          <a href="#"><i class="material-icons brand-logo">store</i></a>
          <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
          <ul className="right hide-on-med-and-down">
            <li>Hi,{state.name}</li>
            <li><a href="#"><i class="material-icons" onClick={viewCart}>shopping_cart</i></a></li>
            <li><i class="material-icons" onClick={signOut}>logout</i></li>
          </ul>
        </div>
      </nav>

      <div class="container mt-3 alert grey darken-1 text-white alert-dismissible fade show" role="alert">
        <strong onMouseEnter={alertBack}>{alert}</strong>
        
      </div>
      
      <div class="row container mt-5">
        {card}      
      </div>   
    </div>
  );
}

export default Shopping;
