import React from 'react';
import Layout from './Hoc/Layout';
import { Switch, Route } from 'react-router-dom';
import Home from './Components/Home';
import Product from './Components/Product';
import Search from './Components/Search';
import Catalogue from './Components/Catalogue';
import Checkout from './Components/Checkout';
import Profile from './Components/Profile';
const Routes = (props) => {
  return(
    <Layout>
        <Switch>
          <Route {...props}  exact component={Home} path="/" />
          <Route {...props}  exact component={Search} path="/search/:value" />
          <Route {...props}  exact component={Product} path="/products/:id" />
          <Route {...props}  exact component={Catalogue} path="/catalogue/:id/:name" />
          <Route {...props}  exact component={Checkout} path="/checkout" />
          <Route {...props}  exact component={Profile} path="/profile" />
        </Switch>
    </Layout>
  )
}

export default Routes;
