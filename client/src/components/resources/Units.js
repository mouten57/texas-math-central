//UnitIndex displays the table of all available
//TOPICS, like B.O.Y., Addition/Mult, APV, etc.

import _ from 'lodash';
import React, { Component } from 'react';
import { Table, Breadcrumb } from 'semantic-ui-react';
import unitFields from './unitFields';
import { Link } from 'react-router-dom';

export default class Resources extends Component {
  state = {
    column: null,
    data: unitFields,
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

        <h2>UNITS</h2>
        <Table sortable celled style={{ marginBottom: '10px' }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === 'name' ? direction : null}
                onClick={this.handleSort('name')}
              >
                Unit
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
              <Table.Cell>Just a test</Table.Cell>
              <Table.Cell>
                <Link to="/resource">See More Resources</Link>
              </Table.Cell>
            </Table.Row>
            {_.map(data, ({ name, description }) => (
              <Table.Row key={name}>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{description}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}
