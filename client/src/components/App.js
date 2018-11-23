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

import { Container } from 'semantic-ui-react';
import ResourceNew from './resources/ResourceNew';
import UploadForm from '../components/Uploads/UploadForm';
import WelcomeMessage from './WelcomeMessage';

import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: [],
      user: null
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
  }

  render() {
    const myResourceIndex = props => {
      return <ResourceIndex resources={this.state.resources} {...props} />;
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
            <Route exact path="/units/:name" render={myResourceIndex} />
            <Route
              exact
              path="/units/:name/:id"
              component={IndividualResource}
            />

            <Route exact path="/resources/new" component={ResourceNew} />
            <Route exact path="/upload" component={UploadForm} />
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
