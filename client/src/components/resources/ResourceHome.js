import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ResourceCard from './ResourceCard';
import { Header, Breadcrumb, Grid, Container } from 'semantic-ui-react';
import resourceTypes from './resourceTypes';
import _ from 'lodash';

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
          <Breadcrumb.Section active>B.O.Y.</Breadcrumb.Section>
        </Breadcrumb>
        <Header as="h3" dividing block>
          B.O.Y.
        </Header>

        <Grid columns={3} stackable centered>
          {this.renderContent()}
        </Grid>
      </Container>
    );
  }
}

export default Resource;
