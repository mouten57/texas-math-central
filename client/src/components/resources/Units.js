//UnitIndex displays the table of all available
//TOPICS, like B.O.Y., Addition/Mult, APV, etc.

import _ from 'lodash';
import React, { Component } from 'react';
import { Table, Breadcrumb } from 'semantic-ui-react';
import unitFields from './data/unitFields.js';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

class Units extends Component {
  state = {
    column: null,
    data: unitFields.slice(1), //remove blank placeholder object
    direction: null,
    units: []
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
          <Breadcrumb.Section>
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
            {_.map(data, ({ name, description, param }) => (
              <Table.Row key={name}>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>
                  {' '}
                  <Link to={`/units/${param}`}> {description} </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps)(Units);
