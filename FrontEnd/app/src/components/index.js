/* eslint-disable */
import { React, useEffect} from "react";
import '../style/main.css';
import actions from '../redux/actions';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import { useGoogleLogin } from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import axios from "axios";

const Index = () => {

  const dispatch = useDispatch();
  var state = useSelector(state => state);
  const history = useHistory();

  const responseFacebook = (response) => {

    var data = {
      userid: response.email
    }

    axios.get("https://prskid1000.herokuapp.com/getitems", {
      "Content-Type": "application/json"
    })
      .then(res => {
        if (res.data.success === "True") {
          //console.log('Login Success: currentUser:', response.profileObj);
          actions.updateName.payload.name = response.name;
          actions.updateEmail.payload.email = response.email;
          actions.updateItems.payload.items = res.data.data;
          dispatch(actions.updateItems);
          dispatch(actions.updateName);
          dispatch(actions.updateEmail);
          axios.post("https://prskid1000.herokuapp.com/getcart", data, {
            "Content-Type": "application/json"
          })
            .then(rpy => {
              
              if (rpy.data.success === "False") {
                axios.post("https://prskid1000.herokuapp.com/createcart", data, {
                  "Content-Type": "application/json"
                }).then(ans => {
                  //console.log(ans.data.data.cart);
                  actions.setCartItem.payload.items = ans.data.data.cart;
                  dispatch(actions.setCartItem);
                  //console.log(state);
                  history.push('/shopping');
                });
              }
              else {
                //console.log(rpy.data.data.cart);
                actions.setCartItem.payload.items = rpy.data.data.cart;
                dispatch(actions.setCartItem);
                //console.log(state);
                history.push('/shopping');
              }
            });
        }
      });
  }

  const onSuccess = (response) => {

    var data = {
      userid: response.profileObj.email
    }

    console.log(response.profileObj.email);

    axios.get("https://prskid1000.herokuapp.com/getitems", {
      "Content-Type": "application/json"
    })
      .then(res => {
        if (res.data.success === "True") {
          //console.log('Login Success: currentUser:', response.profileObj);
          actions.updateName.payload.name = response.profileObj.name;
          actions.updateEmail.payload.email = response.profileObj.email;
          actions.updateItems.payload.items = res.data.data;
          dispatch(actions.updateItems);
          dispatch(actions.updateName);
          dispatch(actions.updateEmail);
          axios.post("https://prskid1000.herokuapp.com/getcart", data, {
            "Content-Type": "application/json"
          })
          .then(rpy => {
            if(rpy.data.success === "False")
            {
              axios.post("https://prskid1000.herokuapp.com/createcart", data, {
                "Content-Type": "application/json"
              }).then(ans => {
                //console.log(ans.data.data.cart);
                actions.setCartItem.payload.items = ans.data.data.cart;
                dispatch(actions.setCartItem);
                //console.log(state);
                history.push('/shopping');
              });
            }
            else
            {
              //console.log(rpy.data.data.cart);
              actions.setCartItem.payload.items = rpy.data.data.cart;
              dispatch(actions.setCartItem);
              //console.log(state);
              history.push('/shopping');
            }
          });
        }
      });
  };
 
  const onFailure = (res) => {
    console.log('Login failed: res:', res);
    alert(
      `Failed to login. 😢 Please ping this to repo owner twitter.com/sivanesh_fiz`
    );
  };

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId: '276593425300-604na80o4eu6n69crv65vubq4a1b3f5t.apps.googleusercontent.com',
    isSignedIn: true,
    accessType: 'offline',
    // responseType: 'code',
    // prompt: 'consent',
  });

  return (
    <div>
      <nav className="grey darken-4">
        <div className="nav-wrapper m-5 ">
          <a href="#"><i class="material-icons">store</i></a>
          <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="material-icons">menu</i></a>
          <ul className="right hide-on-med-and-down">
          </ul>
        </div>
      </nav>
      <center>
        <div className="row m-5"></div>
        <div className="row m-5"></div>
        <div className="row m-5"></div>
        <div className="col-4 grey darken-4 m-5 pt-5 pb-3 pr-5">
          <div className="row">
            <i class="fa fa-google white-text large col-4" aria-hidden="true"></i>
            <button onClick={signIn} className="grey darken-4 col-8">
              <span className="flow-text white-text ontWeightBold"><h5>Sign in with Google</h5></span>
            </button>
          </div>
        </div>
      </center>

      <center>
        <div className="col-4 grey darken-4 m-5 pt-5 pb-3 pr-5">
          <div className="row">
            <i class="material-icons white-text large col-4">facebook</i>
            <FacebookLogin
              appId="2459538504191620"
              autoLoad={false}
              fields="name,email"
              callback={responseFacebook}
              cssClass="grey darken-4 pt-3 ontWeightBold pb-3 col pr-5 ml-3 m-1 pl-5 mt-3 mb-1 flow-text white-text"
            />
          </div>
        </div>
      </center>

    </div>
  );
}

export default Index;
