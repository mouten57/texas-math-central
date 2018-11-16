import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Landing from './Landing';

import Header from './Header';
import About from './About';
import Units from './resources/Units';
import ResourceIndex from './resources/ResourceIndex';

import { Container } from 'semantic-ui-react';
import ResourceNew from './resources/ResourceNew';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }
  render() {
    return (
      <Container>
        <BrowserRouter>
          <div>
            <Header />
            <Route exact path="/" component={Landing} />
            <Route exact path="/about" component={About} />
            <Route exact path="/resource" component={ResourceIndex} />
            <Route exact path="/units" component={Units} />

            <Route exact path="/resources/new" component={ResourceNew} />
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
