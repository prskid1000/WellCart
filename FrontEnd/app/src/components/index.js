/* eslint-disable */
import { React, useEffect} from "react";
import '../style/main.css';
import actions from '../redux/actions';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import FacebookLogin from 'react-facebook-login';
import { GoogleLogin } from 'react-google-login';
import axios from "axios";

const Index = () => {

  const dispatch = useDispatch();
  var state = useSelector(state => state);
  const history = useHistory();

  const onFSuccess = (response) => {

    var data = {
      userid: response.email
    }

    axios.get("https://wellcart.herokuapp.com/getitems", {
      "Content-Type": "application/json"
    })
      .then(res => {
        if (res.data.success === "True") {
          //console.log('Login Success: currentUser:', response.profileObj);
          actions.updateName.payload.name = response.name;
          actions.updateEmail.payload.email = response.email;
          actions.setItem.payload.items = res.data.data;
          dispatch(actions.setItem);
          dispatch(actions.updateName);
          dispatch(actions.updateEmail);

          if(response.email != "prskid1000@gmail.com")
          {
            axios.post("https://wellcart.herokuapp.com/getcart", data, {
              "Content-Type": "application/json"
            })
              .then(rpy => {

                if (rpy.data.success === "False") {
                  axios.post("https://wellcart.herokuapp.com/createcart", data, {
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
          else
          {
            history.push('/admin');
          }
        }
      });
  }

  const onGSuccess = (response) => {

    var data = {
      userid: response.profileObj.email
    }

    console.log(response.profileObj.email);

    axios.get("https://wellcart.herokuapp.com/getitems", {
      "Content-Type": "application/json"
    })
      .then(res => {
        if (res.data.success === "True") {
          //console.log('Login Success: currentUser:', response.profileObj);
          actions.updateName.payload.name = response.profileObj.name;
          actions.updateEmail.payload.email = response.profileObj.email;
          actions.setItem.payload.items = res.data.data;
          dispatch(actions.setItem);
          dispatch(actions.updateName);
          dispatch(actions.updateEmail);
         
          if (response.profileObj.email != "prskid1000@gmail.com") {
            axios.post("https://wellcart.herokuapp.com/getcart", data, {
              "Content-Type": "application/json"
            })
              .then(rpy => {

                if (rpy.data.success === "False") {
                  axios.post("https://wellcart.herokuapp.com/createcart", data, {
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
          else {
            history.push('/admin');
          }
        }
      });
  };

  var link_1 = (event) => {
    window.location = 'https://ichatweb.netlify.app/'
  }

  var link_2 = (event) => {
    window.location = 'https://codenut.netlify.app/'
  }


  return (
    <div>
      <nav className="grey darken-4">
        <div className="nav-wrapper m-5 ">
          <i className="material-icons clickable">store</i>
        </div>
      </nav>
      <div className="row mt-5">

        <div className="jumbotron col-sm-4 hide-on-med-and-up">
          <h2><i className="material-icons large">store</i>WellCart</h2>
          <div className="well mt-5">
            <GoogleLogin
              clientId="276593425300-9gr4rrto1v5411tnnc4r128bf7c6u1sv.apps.googleusercontent.com"
              render={renderProps => (
                <button className="btn waves-effect waves-light grey darken-4 white-text col-sm" onClick={renderProps.onClick} type="submit" name="action">
                  GOOGLE LOGIN
                </button>
              )}
              onSuccess={onGSuccess}
              cookiePolicy={'single_host_origin'}
            />
          </div>
          <div className="well mt-5">
            <FacebookLogin
              appId="257999539314518"
              cssClass="btn waves-effect waves-light grey darken-4 white-text col-sm"
              fields="name,email,picture"
              textButton="FACEBOOK LOGIN"
              autoLoad={false}
              callback={onFSuccess}
            />
          </div>

        </div>

        <div className="jumbotron col-sm-8 hide-on-small-only ml-5 mt-5">
          <h2><i className="material-icons large ml-5">store</i>WellCart</h2>
          <div className="well col mt-5">
            <GoogleLogin
              clientId="276593425300-9gr4rrto1v5411tnnc4r128bf7c6u1sv.apps.googleusercontent.com"
              render={renderProps => (
                <button className="btn waves-effect waves-light grey darken-4 white-text col-sm" onClick={renderProps.onClick} type="submit" name="action">
                  GOOGLE LOGIN
                </button>
              )}
              onSuccess={onGSuccess}
              cookiePolicy={'single_host_origin'}
            />
          </div>
          <div className="well col mt-5">
            <FacebookLogin
              appId="257999539314518"
              cssClass="btn waves-effect waves-light grey darken-4 white-text col-sm"
              fields="name,email,picture"
              textButton="FACEBOOK LOGIN"
              autoLoad={false}
              callback={onFSuccess}
            />
          </div>
        </div>
      
        <div className="col-sm-3 mt-5 hide-on-small-only">
          <div className="card row p-3 mt-5 grey darken-4 white-text">
            <center><h3 className="clickable" onClick={link_2}>CodeNut</h3></center>
          </div>
          <div className="card row p-3  grey darken-4 white-text">
            <center><h3 className="clickable" onClick={link_1}>IChat</h3></center>
          </div>
        </div>

        <div className="col-sm-3 mt-3 hide-on-med-and-up">
          <div className="card row p-3 grey darken-4 white-text ">
            <center><h4 className="clickable" onClick={link_2}>CodeNut</h4></center>
          </div>
          <div className="card row p-3 grey darken-4 white-text">
            <center><h4 className="clickable" onClick={link_1}>IChat</h4></center>
          </div>
        </div>
      
      </div>
    </div>
  );
}

export default Index;
