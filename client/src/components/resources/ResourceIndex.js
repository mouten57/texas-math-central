//ResourceIndex displays the grid of cards of available TYPES
//of resources
//like worksheets, games, projects, etc.

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ResourceCard from './ResourceCard';
import { Header, Breadcrumb, Grid, Container } from 'semantic-ui-react';
import resourceTypes from './resourceTypes';
import _ from 'lodash';
import ResourceList from './ResourceList';

class Resource extends Component {
  renderContent() {
    return _.map(resourceTypes, ({ name, moreLink }) => {
      return (
        <Grid.Column>
          <ResourceCard key={name} name={name} moreLink={moreLink} />
        </Grid.Column>
      );
    });
  }

  // <Segment>Content</Segment>

  render() {
    return (
      <Container>
        <Breadcrumb>
          <Breadcrumb.Section link>
            <Link to="/">Home</Link>
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section link>
            <Link to="/resources">Resources</Link>
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section active>TEST</Breadcrumb.Section>
        </Breadcrumb>
        <Header as="h3" dividing block>
          TEST
        </Header>

        <Grid columns={3} stackable centered>
          {this.renderContent()}
        </Grid>
        <Container>
          <h2>sample resource uploads</h2>
          <ResourceList />
        </Container>
      </Container>
    );
  }
}

export default Resource;
