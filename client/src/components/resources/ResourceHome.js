import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import ResourceCard from './ResourceCard';
import { Card, Header, Breadcrumb } from 'semantic-ui-react';
import resourceTypes from './resourceTypes';
import _ from 'lodash';

class Resource extends Component {
  renderContent() {
    return _.map(resourceTypes, ({ name, moreLink }) => {
      return <ResourceCard key={name} name={name} moreLink={moreLink} />;
    });
  }

  render() {
    return (
      <div>
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

        <Card.Group itemsPerRow={3}>{this.renderContent()}</Card.Group>
      </div>
    );
  }
}

export default Resource;
