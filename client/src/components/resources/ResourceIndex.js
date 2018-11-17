//ResourceIndex displays the grid of cards of available TYPES
//of resources
//like worksheets, games, projects, etc.

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ResourceCard from './ResourceCard';
import { Header, Breadcrumb, Grid, Container } from 'semantic-ui-react';
import resourceTypes from './resourceTypes';
import _ from 'lodash';
import { connect } from 'react-redux';
import { fetchResources } from '../../actions';
import ResourceList from './ResourceList';

import unitFields from './data/unitFields.js';

class ResourceIndex extends Component {
  renderContent() {
    return _.map(resourceTypes, ({ name, moreLink }) => {
      return (
        <Grid.Column>
          <ResourceCard key={name} name={name} moreLink={moreLink} />
        </Grid.Column>
      );
    });
  }
  filteredUnit() {
    const paramName = this.props.match.params.name;
    for (let i = 0; i < unitFields.length; i++) {
      if (unitFields[i].link === paramName) {
        return unitFields[i].name;
      }
    }
  }
  //Grid layout option
  //  <Grid columns={3} stackable centered>
  // {this.renderContent()}
  // </Grid>

  // <Segment>Content</Segment>

  render() {
    return (
      <Container>
        <Breadcrumb>
          <Breadcrumb.Section>
            <Link to="/">Home</Link>
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section>
            <Link to="/units">Resources</Link>
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section active>{this.filteredUnit()}</Breadcrumb.Section>
        </Breadcrumb>
        <Header as="h3" dividing block>
          {this.filteredUnit()}
        </Header>

        <Container>
          <ResourceList name={this.filteredUnit()} />
        </Container>
      </Container>
    );
  }
}

function mapStateToProps({ resources }) {
  return { resources };
}

export default connect(
  mapStateToProps,
  { fetchResources }
)(ResourceIndex);
