//ResourceList lists out all the resources from mongo
//  /units/:name/
// this is inside resource index
import { connect } from "react-redux";
import React, { Component } from "react";
import _ from "lodash";
import { Table, Icon, Confirm } from "semantic-ui-react";
import { Link } from "react-router-dom";
import unitFields from "./data/unitFields.js";
import "./style/ResourceList.css";

class ResourceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      column: null,
      data: this.props.resources,
      direction: "descending",
      resourceToDelete: null,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      data: nextProps.resources,
      column: "voteTotal",
      data: _.sortBy(nextProps.resources, ["voteTotal"]).reverse(),
      direction: "descending",
    });
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
  handleSort = (clickedColumn) => () => {
    const { column, data, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]).reverse(),
        direction: "descending",
      });
      return;
    }

    this.setState({
      data: data.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending",
    });
  };

  render() {
    const resources = [...this.props.resources];
    const { open, column, data, direction } = this.state;

    return (
      <Table style={{ marginBottom: "10px" }} unstackable sortable>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === "name" ? direction : null}
              onClick={this.handleSort("name")}
            >
              Name
            </Table.HeaderCell>
            <Table.HeaderCell
              textAlign="center"
              sorted={column === "type" ? direction : null}
              onClick={this.handleSort("type")}
            >
              Type
            </Table.HeaderCell>
            <Table.HeaderCell
              textAlign="center"
              sorted={column === "voteTotal" ? direction : null}
              onClick={this.handleSort("voteTotal")}
            >
              Votes
            </Table.HeaderCell>
            <Table.HeaderCell
              textAlign="center"
              sorted={column === "created_at" ? direction : null}
              onClick={this.handleSort("created_at")}
            >
              Date Added
            </Table.HeaderCell>
            <Table.HeaderCell> </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {this.state.data?.map((resource) => {
            return (
              <Table.Row
                key={resource._id}
                style={{ marginTop: "10px" }}
                verticalAlign="middle"
              >
                <Table.Cell
                  width={
                    resource._user == this.props.auth._id ||
                    this.props.auth?.role == "admin"
                      ? 1
                      : 2
                  }
                >
                  <Link
                    to={{
                      pathname: `/units/${this.match(resource)}/${
                        resource._id
                      }`,
                      state: {
                        unitResources: resources,
                      },
                    }}
                  >
                    {resource.name}
                  </Link>
                </Table.Cell>
                <Table.Cell width={1} textAlign="center">
                  {resource.type}
                </Table.Cell>
                <Table.Cell width={1} textAlign="center">
                  {resource.voteTotal}
                </Table.Cell>
                <Table.Cell width={1} textAlign="center">
                  {new Date(resource.created_at).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell width={1} textAlign="center">
                  {resource._user == this.props.auth._id ||
                  this.props.auth?.role == "admin" ? (
                    <Icon
                      name="delete"
                      className="custom_icon"
                      onClick={() => this.show(resource._id)}
                    />
                  ) : null}
                </Table.Cell>
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
