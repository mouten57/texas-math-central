import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Landing from './Landing';

import Header from './Header';
import About from './About';
import ResourceIndex from './resources/ResourceTopicIndex';
import ResourceHome from './resources/ResourceHome';

import { Container } from 'semantic-ui-react';
import HeaderItems from './HeaderItems';

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }
  render() {
    return (
      <Container>
        <BrowserRouter>
          <div>
            <Header
              leftItems={HeaderItems.leftItems}
              rightItems={HeaderItems.rightItems}
            />
            <Route exact path="/" component={Landing} />
            <Route exact path="/about" component={About} />
            <Route exact path="/resources" component={ResourceIndex} />
            <Route exact path="/resource" component={ResourceHome} />
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
