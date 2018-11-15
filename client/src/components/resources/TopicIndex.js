//TopicIndex displays the table of all available
//TOPICS, like B.O.Y., Addition/Mult, APV, etc.

import _ from 'lodash';
import React, { Component } from 'react';
import { Table, Breadcrumb } from 'semantic-ui-react';
import resourceTypes from './resourceTopics';
import { Link } from 'react-router-dom';
import ResourceList from './ResourceList';
import { Container } from 'semantic-ui-react';

export default class Resources extends Component {
  state = {
    column: null,
    data: resourceTypes,
    direction: null
  };

  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending'
      });

      return;
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending'
    });
  };

  render() {
    const { column, data, direction } = this.state;

    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Section link>
            <Link to="/">Home</Link>
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section active>Resources</Breadcrumb.Section>
        </Breadcrumb>
        <Container>
          <ResourceList />
        </Container>

        <Table sortable celled style={{ marginBottom: '10px' }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === 'resource' ? direction : null}
                onClick={this.handleSort('resource')}
              >
                Topic
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'description' ? direction : null}
                onClick={this.handleSort('description')}
              >
                Description
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Test</Table.Cell>
              <Table.Cell>
                <Link to="/resource">See More Resources</Link>
              </Table.Cell>
            </Table.Row>
            {_.map(data, ({ resource, description }) => (
              <Table.Row key={resource}>
                <Table.Cell>{resource}</Table.Cell>
                <Table.Cell>{description}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}
