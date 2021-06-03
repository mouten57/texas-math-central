import React, { Component } from "react";
import { NotificationContainer } from "react-notifications";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";
import { Container } from "semantic-ui-react";
import * as actions from "../actions";
//stripe checkout
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
//socket
import openSocket from "socket.io-client";
//import components
import Landing from "./Landing";
import Header from "./Header";
import About from "./About";
import Units from "./Resources/Units.js";
import ResourceIndex from "./Resources/ResourceIndex";
import IndividualResource from "./Resources/IndividualResource/IndividualResource";
import UserProfile from "./UserProfile";
import NewResource from "./Resources/NewResource/NewResource";
import WelcomeMessage from "./WelcomeMessage";
import Cart from "./Cart/Cart";
import CartTable from "./Cart/CartTable";
import Upgrade from "./UpgradeAllAccess";
import CheckoutForm from "./Checkout/CheckoutForm";
import AdminPage from "./Admin/Admin";
import NotAuthorized from "./NotAuthorized";
import LoginPage from "./Login/Login";
import SignUpPage from "./SignUp/SignUp";

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
    //get all resources
    this.props.fetchResources();
  }
  fetchCart = () => {
    this.props.fetchCart();
  };

  render() {
    // console.log(this.props);
    return (
      <Container style={{padding: "5px 0 40px 0"}}>
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
                  fetchResources={this.props.fetchResources}
                  socket={socket}
                />
              )}
            />

            <Route
              exact
              path="/Resources/new"
              render={(props) => (
                <NewResource
                  {...props}
                  fetchResources={this.props.fetchResources}
                />
              )}
            />
            <Route
              exact
              path="/cart"
              render={(props) => (
                <CartTable
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
            <Route
              exact
              path="/login"
              render={(props) => (
                <LoginPage
                  auth={this.props.auth}
                  cart={this.props.cart}
                  resources={this.props.resources}
                  fetchUser={this.props.fetchUser}
                  fetchCart={this.props.fetchCart}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/signup"
              render={(props) => (
                <SignUpPage
                  auth={this.props.auth}
                  cart={this.props.cart}
                  resources={this.props.resources}
                  fetchUser={this.props.fetchUser}
                  fetchCart={this.props.fetchCart}
                  {...props}
                />
              )}
            />
            <Route
              exact
              path="/admin"
              render={(props) =>
                this.props?.auth?.role == "admin" ? (
                  <AdminPage
                    auth={this.props.auth}
                    cart={this.props.cart}
                    resources={this.props.resources}
                    fetchUser={this.props.fetchUser}
                    fetchCart={this.props.fetchCart}
                    {...props}
                  />
                ) : this.props.auth ? (
                  <NotAuthorized {...props} />
                ) : null
              }
            />
          </div>
        </BrowserRouter>
        <NotificationContainer />
      </Container>
    );
  }
}
function mapStateToProps(state) {
  return { auth: state.auth, cart: state.cart, resources: state.resources };
}

export default connect(mapStateToProps, actions)(App);
