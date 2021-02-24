import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './redux/store'
import Index from './components/index.js';
import Cart from './components/cart.js';
import Shopping from './components/shopping.js';

function App() {
  return (
    <Router>
      <Provider store={store}>
        <Switch>
          <Route exact path="/" component={Index} />
          <Route path="/index" component={Index} />
          <Route path="/cart" component={Cart} />
          <Route path="/shopping" component={Shopping} />
        </Switch>
      </Provider>
    </Router>
  );
}

export default App;