//ResourceList lists out all the resources from mongo
//  /units/:name/
// this is inside resource index

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchResources } from '../../actions';
import { Table } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import unitFields from './data/unitFields.js';

class ResourceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: []
    };
  }
  componentDidMount() {
    this.props.fetchResources();
  }
  componentWillReceiveProps(nextProps) {
    let filteredResources = nextProps.resources.filter(
      resource => resource.unit === this.props.param
    );

    this.setState({ resources: filteredResources });
  }

  match(resource) {
    for (let i = 0; i < unitFields.length; i++) {
      if (resource.unit === unitFields[i].param) {
        return unitFields[i].param;
      }
    }
  }

  renderResources() {
    return this.state.resources.reverse().map(resource => {
      return (
        <Table.Row key={resource._id} style={{ marginTop: '10px' }}>
          <Table.Cell>{resource.name}</Table.Cell>
          <Table.Cell>{resource.type}</Table.Cell>
          <Table.Cell>
            <Link to={`/units/${this.match(resource)}/${resource._id}`}>
              Click Here
            </Link>
          </Table.Cell>
          <Table.Cell>
            {new Date(resource.dateSent).toLocaleDateString()}
          </Table.Cell>
        </Table.Row>
      );
    });
  }

  render() {
    return (
      <Table style={{ marginBottom: '10px' }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Link</Table.HeaderCell>
            <Table.HeaderCell>Date Added</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{this.renderResources()}</Table.Body>
      </Table>
    );
  }
}

function mapStateToProps({ resources }) {
  return { resources };
}

export default connect(
  mapStateToProps,
  { fetchResources }
)(ResourceList);
