/* eslint-disable */
import { React, useState } from "react";
import '../style/main.css';
import actions from '../redux/actions';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { useGoogleLogout } from 'react-google-login';
import axios from "axios";

const Admin = () => {

  const dispatch = useDispatch();
  var state = useSelector(state => state);
  const history = useHistory();

  const [uid, setUid] = useState(0);
  const [refresh, setRefresh] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  var viewShop = (event) => {
    history.push('/shopping');
  }

  var handleChange = (event) => {
    console.log(event.target.value);
    switch(event.target.id)
    {
      case 'uid':
        setUid(event.target.value);
        break;

      case 'name':
        setName(event.target.value);
        break;

      case 'description':
        setDescription(event.target.value);
        break;

      case 'price':
        setPrice(event.target.value);
    }
    
  }



  const onLogoutSuccess = (res) => {
    history.push('/index');
    //console.log('Logged out Success');
    //alert('Logged out Successfully ✌');
  };

  const { signOut } = useGoogleLogout({
    clientId: '276593425300-9gr4rrto1v5411tnnc4r128bf7c6u1sv.apps.googleusercontent.com',
    onLogoutSuccess,
  });

  var deleteItem = (event) => {

    var data = {
      id: state.items[parseInt(event.target.id)].id
    }
    
    axios.post("https://wellcart.herokuapp.com/removeitem", data, {
      "Content-Type": "application/json"
    })
      .then(res => {
        if (res.data.success === "True") {
          actions.deleteItem.payload.items = state.items;
          actions.deleteItem.payload.idx = parseInt(event.target.id);
          dispatch(actions.deleteItem);
          setRefresh(state);
        }
      });

    }

  var addItem = (event) => {

    var data = {
      id: uid,
      name: name,
      price: price,
      description: description
    }

    axios.post("https://wellcart.herokuapp.com/additem", data, {
      "Content-Type": "application/json"
    })
      .then(res => {
        console.log(res.data);
        if (res.data.success === "True") {
          actions.addItem.payload.item = res.data.data;
          dispatch(actions.addItem);
          setRefresh(state);
        }
      });

  }

  var card = [];
  var card2 = [];

  var j = 0;
  var createMap = () => {
    state.items.map((item, index) => {
      {
        card.push(
          <div className="col-4">
            <div className="card">
              <div className="card-image">
                <img src="http://simpleicon.com/wp-content/uploads/Code-Optimization.svg" height="250" width="50"></img>
              </div>
              <div className="card-content">
                <div className="card-title black-text text-right row">{'\u20B9'}{item.price}</div>
                <div className="card-title black-text col row"><h4>{item.name}</h4></div>
                <p className="black-text col row">{item.description}</p>
                <a className="btn-floating halfway-fab waves-effect waves-light grey darken-4 btn-large"><i id={j} class="material-icons" onClick={deleteItem}>delete</i></a>
              </div>
            </div>
          </div>
        );

        card2.push(
          <div className="col-12 mb-3">
            <div className="card">
              <div className="card-image">
                <img src="http://simpleicon.com/wp-content/uploads/Code-Optimization.svg" height="200" width="50"></img>
              </div>
              <div className="card-content">
                <div className="card-title black-text text-right row">{'\u20B9'}{item.price}</div>
                <div className="card-title black-text col row"><h4>{item.name}</h4></div>
                <p className="black-text col row">{item.description}</p>
                <a className="btn-floating halfway-fab waves-effect waves-light grey darken-4 btn-large"><i id={j++} class="material-icons" onClick={deleteItem}>delete</i></a>
              </div>
            </div>
          </div>
        );
      }
    });
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
      <div className="row mt-5">
        <div className="jumbotron col-sm-8 ml-5 hide-on-small-only">
          <center><h2><i className="material-icons large mt-5 pt-5 pb-5">store</i>WellCart</h2></center>
        </div>
        <div className="jumbotron col-sm-8 hide-on-med-and-up"> 
          <center><h2><i className="material-icons large mt-5 pt-5 pb-5">store</i>WellCart</h2></center>
        </div>
        <div class="col-sm-3 mt-3 ml-5">
          <div class="well">
            <form>
              <br></br>

              <div class="input-group form-group col-10">
                <div class="input-group-prepend">
                  <span><i class="material-icons">opacity</i>UID</span>
                </div>
                <input type="text" class="form-control" onChange={handleChange} id="uid"></input>
              </div>

              <div class="input-group form-group col-10">
                <div class="input-group-prepend">
                  <span><i class="material-icons">opacity</i>Name</span>
                </div>
                <input type="text" class="form-control" onChange={handleChange} id="name"></input>
              </div>

              <div class="input-group form-group col-10">
                <div class="input-group-prepend">
                  <span><i class="material-icons">opacity</i>Description</span>
                </div>
                <input type="text" class="form-control" onChange={handleChange} id="description"></input>
              </div>

              <div class="input-group form-group col-10">
                <div class="input-group-prepend">
                  <span><i class="material-icons">opacity</i>Price</span>
                </div>
                <input type="text" class="form-control" onChange={handleChange} id="price"></input>
              </div>

              <div class="form-group row ml-5">
                <input type="button" onClick={addItem} value="Create or Modify" class="btn float-right grey darken-4 col-8 m-1"></input>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="container">
        {createMap()}
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

export default Admin;
