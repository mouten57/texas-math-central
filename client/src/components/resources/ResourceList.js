//ResourceList lists out all the resources from mongo
//will need to filter for diff pages

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchResources } from '../../actions';
import { Card, Table } from 'semantic-ui-react';

class ResourceList extends Component {
  componentDidMount() {
    this.props.fetchResources();
  }

  renderResources() {
    return this.props.resources.reverse().map(resource => {
      return (
        <Table.Row key={resource.id} style={{ marginTop: '10px' }}>
          <Table.Cell>{resource.name}</Table.Cell>
          <Table.Cell>{resource.unit}</Table.Cell>
          <Table.Cell>{resource.type}</Table.Cell>
          <Table.Cell>
            <a href="{resource.link}"> {resource.name}</a>
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
            <Table.HeaderCell>Unit</Table.HeaderCell>
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
