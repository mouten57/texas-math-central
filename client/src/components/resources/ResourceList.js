//ResourceList lists out all the resources from mongo
//  /units/:name/
// this is inside resource index
import { connect } from "react-redux";
import React, { Component } from "react";

import { Table, Icon, Confirm } from "semantic-ui-react";
import { Link } from "react-router-dom";
import unitFields from "./data/unitFields.js";
import "./style/ResourceList.css";

class ResourceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      resourceToDelete: null,
    };
  }
  show = (resource) =>
    this.setState({ open: true, resourceToDelete: resource });

  handleConfirm = () => {
    this.props.onDeleteResource(this.state.resourceToDelete, (err, result) => {
      if (err) throw err;
      this.setState({ result: "confirmed", open: false });
      this.props.fetchCart();
    });
  };
  handleCancel = () => this.setState({ result: "cancelled", open: false });
  match(resource) {
    for (let i = 0; i < unitFields.length; i++) {
      if (resource.unit === unitFields[i].param) {
        return unitFields[i].param;
      }
    }
  }

  render() {
    const { open } = this.state;
    return (
      <Table style={{ marginBottom: "10px" }} unstackable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Date Added</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.props.resources.map((resource) => {
            return (
              <Table.Row key={resource._id} style={{ marginTop: "10px" }}>
                <Table.Cell
                  width={
                    resource._user == this.props.auth._id ||
                    this.props.auth?.role == "admin"
                      ? 9
                      : 10
                  }
                >
                  <Link to={`/units/${this.match(resource)}/${resource._id}`}>
                    {resource.name}
                  </Link>
                </Table.Cell>
                <Table.Cell width={3}>{resource.type}</Table.Cell>
                <Table.Cell width={3}>
                  {new Date(resource.created_at).toLocaleDateString()}
                </Table.Cell>

                {resource._user == this.props.auth._id ||
                this.props.auth?.role == "admin" ? (
                  <Table.Cell width={1} textAlign="center">
                    <Icon
                      name="delete"
                      className="custom_icon"
                      onClick={() => this.show(resource._id)}
                    />
                  </Table.Cell>
                ) : null}
              </Table.Row>
            );
          })}
        </Table.Body>
        <Confirm
          open={open}
          size="tiny"
          cancelButton="Cancel"
          confirmButton="Delete Resource"
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />
      </Table>
    );
  }
}
function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps)(ResourceList);
