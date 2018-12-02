import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Landing from './Landing';

import Header from './Header';
import About from './About';
import Units from './resources/Units';
import ResourceIndex from './resources/ResourceIndex';
import IndividualResource from './resources/IndividualResource';
import UserProfile from './UserProfile';
import { Container } from 'semantic-ui-react';

import NewResource from './Uploads/NewResource';
import WelcomeMessage from './WelcomeMessage';

import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      user: null,
      comments: []
    };
  }
  componentDidMount() {
    //get User
    this.props.fetchUser();
    axios.get('/api/current_user').then(res => {
      const user = res.data || false;
      this.setState({ user });
    });

    //set Resources
    axios.get('/api/resources').then(res => {
      const resources = res.data;
      this.setState({ resources });
    });

    //set comments
    axios.get('/api/comments').then(res => {
      const comments = res.data;
      this.setState({ comments });
    });
  }

  render() {
    const myResourceIndex = props => {
      return (
        <ResourceIndex
          resources={this.state.resources}
          {...props}
          user={this.state.user}
        />
      );
    };
    const myIndividualResource = props => {
      return <IndividualResource resources={this.state.resources} {...props} />;
    };
    const myUserProfile = props => {
      return (
        <UserProfile
          comments={this.state.comments}
          resources={this.state.resources}
          {...props}
        />
      );
    };

    return (
      <Container>
        <BrowserRouter>
          <div>
            <Header />
            <WelcomeMessage user={this.state.user} />
            <Route exact path="/" component={Landing} />
            <Route exact path="/about" component={About} />
            <Route exact path="/units" component={Units} />
            <Route exact path="/profile" component={myUserProfile} />
            <Route exact path="/units/:name" render={myResourceIndex} />
            <Route
              exact
              path="/units/:name/:id"
              component={myIndividualResource}
            />

            <Route exact path="/resources/new" component={NewResource} />
          </div>
        </BrowserRouter>
      </Container>
    );
  }
}

export default connect(
  null,
  actions
)(App);
