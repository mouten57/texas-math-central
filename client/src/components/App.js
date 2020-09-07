import React, { Component } from "react";
import { NotificationContainer } from "react-notifications";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";
import Landing from "./Landing";

import Header from "./Header";
import About from "./About";
import Units from "./Resources/Units.js";
import ResourceIndex from "./Resources/ResourceIndex";
import IndividualResource from "./Resources/IndividualResource";
import UserProfile from "./UserProfile";
import { Container } from "semantic-ui-react";

import NewResource from "./Uploads/NewResource";
import WelcomeMessage from "./WelcomeMessage";
import Cart from "./Cart";
import Upgrade from "./UpgradeAllAccess";
//stripe checkout
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./Checkout/CheckoutForm";

//socket
import openSocket from "socket.io-client";
const keys = require("../components/SocketIO/SocketIO");
const socket = openSocket(keys.socketPath);

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      comments: [],
    };
  }

  componentDidMount() {
    //get User
    this.props.fetchUser();
    //get ShoppingCart
    this.props.fetchCart();
  }
  fetchCart = () => {
    this.props.fetchCart();
  };

  render() {
    console.log(this.props);
    return (
      <Container>
        <BrowserRouter>
          <div>
            <Header />
            <WelcomeMessage user={this.props.auth} />
            <Route exact path="/" component={Landing} />
            <Route
              exact
              path="/about"
              render={(props) => <About {...props} />}
            />
            <Route
              exact
              path="/units"
              render={(props) => <Units {...props} />}
            />
            <Route
              exact
              path="/profile"
              render={(props) => (
                <UserProfile {...props} fetchCart={this.props.fetchCart} />
              )}
            />
            <Route
              exact
              path="/units/:unit"
              render={(props) => (
                <ResourceIndex
                  {...props}
                  fetchCart={this.props.fetchCart}
                  auth={this.props.auth}
                  cart={this.props.cart}
                />
              )}
            />
            <Route
              exact
              path="/units/:unit/:id"
              render={(props) => (
                <IndividualResource
                  {...props}
                  fetchCart={this.props.fetchCart}
                  socket={socket}
                />
              )}
            />

            <Route
              exact
              path="/Resources/new"
              render={(props) => <NewResource {...props} />}
            />
            <Route
              exact
              path="/cart"
              render={(props) => (
                <Cart
                  {...props}
                  auth={this.props.auth}
                  cart={this.props.cart}
                  fetchCart={this.props.fetchCart}
                />
              )}
            />
            <Route
              exact
              path="/upgrade"
              render={(props) => <Upgrade {...props} />}
            />
            <Route
              exact
              path="/checkout"
              render={(props) => (
                <Elements stripe={stripePromise}>
                  <CheckoutForm
                    auth={this.props.auth}
                    cart={this.props.cart}
                    fetchUser={this.props.fetchUser}
                    fetchCart={this.props.fetchCart}
                    {...props}
                  />
                </Elements>
              )}
            />
          </div>
        </BrowserRouter>
        <NotificationContainer />
      </Container>
    );
  }
}
function mapStateToProps(state) {
  return { auth: state.auth, cart: state.cart };
}

export default connect(mapStateToProps, actions)(App);
