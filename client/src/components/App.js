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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allResources: []
    };
  }
  componentDidMount() {
    this.props.fetchUser();
    this.setResources(this.props.resources);
  }

  setResources = resources => {
    this.setState({ resources: resources });
  };
  render() {
    return (
      <Container>
        <BrowserRouter>
          <div>
            <Header />
            <Route exact path="/" component={Landing} />
            <Route exact path="/about" component={About} />
            <Route exact path="/units" component={Units} />
            <Route
              exact
              path="/units/:name"
              component={ResourceIndex}
              allResources={this.state.allResources}
            />
            <Route
              exact
              path="/units/:name/:id"
              component={IndividualResource}
            />

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
