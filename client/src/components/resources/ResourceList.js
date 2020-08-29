//ResourceList lists out all the resources from mongo
//  /units/:name/
// this is inside resource index

import React, { Component } from "react";
import _ from "lodash";
import { Table } from "semantic-ui-react";
import { Link } from "react-router-dom";
import unitFields from "./data/unitFields.js";

class ResourceList extends Component {
  constructor(props) {
    super(props);
  }

  match(resource) {
    for (let i = 0; i < unitFields.length; i++) {
      if (resource.unit === unitFields[i].param) {
        return unitFields[i].param;
      }
    }
  }

  renderResources() {
    return this.props.resources.reverse().map((resource) => {
      return (
        <Table.Row key={resource._id} style={{ marginTop: "10px" }}>
          <Table.Cell width={10}>
            <Link to={`/units/${this.match(resource)}/${resource._id}`}>
              {resource.name}
            </Link>
          </Table.Cell>
          <Table.Cell width={3}>{resource.type}</Table.Cell>
          <Table.Cell width={3}>
            {new Date(resource.created).toLocaleDateString()}
          </Table.Cell>
        </Table.Row>
      );
    });
  }

  render() {
    return (
      <Table style={{ marginBottom: "10px" }} unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Date Added</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>{this.renderResources()}</Table.Body>
      </Table>
    );
  }
}

export default ResourceList;
