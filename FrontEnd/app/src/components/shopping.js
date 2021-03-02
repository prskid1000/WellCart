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
    clientId: '276593425300-9gr4rrto1v5411tnnc4r128bf7c6u1sv.apps.googleusercontent.com',
    onLogoutSuccess,
    onFailure,
  });

  var card = [];
  var card2 = [];

  var addItem = (event) => {

    actions.addCartItem.payload.item = event.target.id;
    dispatch(actions.addCartItem);

    var data = {
      userid: state.email,
      item: event.target.id
    }
    
    axios.post("http://localhost:3001/addcartitem", data, {
      "Content-Type": "application/json"
    });
    
    setAlert(event.target.id + " is added to Cart");
  }

  state.items.map((item, index) => {
    {
      card.push(
        <div className="col-6">
          <div className="card">
            <div className="card-image">
              <img src="http://simpleicon.com/wp-content/uploads/Code-Optimization.svg" height="250" width="50"></img>
            </div>
            <div className="card-content">
              <div className="card-title black-text text-right row">{'\u20B9'}{item.price}</div>
              <span className="card-title black-text col row"><h4>{item.name}</h4></span>
              <p className="black-text col row">{item.description}</p>
              <a className="btn-floating halfway-fab waves-effect waves-light grey darken-4 btn-large"><i id={item.id} class="material-icons" onClick={addItem}>add</i></a>
            </div>
          </div>
        </div>  
      );
      card2.push(
        <div className="col-12 mb-3">
          <div className="card">
            <div className="card-image">
              <img src="http://simpleicon.com/wp-content/uploads/Code-Optimization.svg" height="250" width="50"></img>
            </div>
            <div className="card-content">
              <div className="card-title black-text text-right row">{'\u20B9'}{item.price}</div>
              <span className="card-title black-text col row"><h4>{item.name}</h4></span>
              <p className="black-text col row">{item.description}</p>
              <a className="btn-floating halfway-fab waves-effect waves-light grey darken-4 btn-large"><i id={item.id} class="material-icons" onClick={addItem}>add</i></a>
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
        <div className="nav-wrapper m-5">
          <i className="material-icons brand-logo hide-on-small-only clickable">store</i>
          <i className="material-icons brand-logo  left hide-on-med-and-up clickable">store</i>
          <ul className="right">
            <li>Hi,{state.name}</li>
            <li><i className="material-icons clickable p-1" onClick={viewCart}>shopping_cart</i></li>
            <li><i className="material-icons clickable p-1" onClick={signOut}>logout</i></li>
          </ul>
        </div>
      </nav>

      <div className="container mt-3 alert grey darken-1 text-white alert-dismissible fade show" role="alert">
        <strong onMouseEnter={alertBack}>{alert}</strong>
        
      </div>
      
      <div className="container">
        <div className="row hide-on-small-only">
          {card} 
        </div>
        <div className="row hide-on-med-and-up">
          {card2}
        </div>     
      </div>   
    </div>
  );
}

export default Shopping;
