//ResourceList lists out all the resources from mongo
//  /units/:name/
// this is inside resource index
import { connect } from "react-redux";
import React, { Component } from "react";
import _ from "lodash";
import {
  Table,
  Icon,
  Confirm,
  Popup,
  Grid,
  Input,
  Button,
} from "semantic-ui-react";
import axios from "axios";
import { Link } from "react-router-dom";
import unitFields from "./data/unitFields.js";
import "./style/ResourceList.css";
import { createMedia } from "@artsy/fresnel";
import IconForResourceList from "./IconForResourceList";
import getVoteTotal from "./getVoteTotal";

const AppMedia = createMedia({
  breakpoints: {
    mobile: 320,
    tablet: 768,
    computer: 992,
    largeScreen: 1200,
    widescreen: 1920,
  },
});
const mediaStyles = AppMedia.createMediaStyle();
const { Media, MediaContextProvider } = AppMedia;

class ResourceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      column: "voteTotal",
      unit: props.unit,
      data: _.sortBy(props.resources, ["voteTotal"]).reverse(),
      direction: "descending",
      resourceToDelete: null,
      nameSearchVal: "",
      typeSearchVal: "",
      namePopupOpen: false,
      typePopupOpen: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    //console.log(nextProps.resources);
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
    //need to add subject
    let sub = resource.subject.toLowerCase();
    for (let i = 0; i < unitFields[sub].length; i++) {
      if (resource.unit === unitFields[sub][i].param) {
        return unitFields[sub][i].param;
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

  handlePopup = (popuptype, val) => {
    this.setState({ [popuptype]: val == "open" });
    if (val == "close") {
      axios
        .get(`/api/units/${this.state.unit}`, {
          params: {
            name: this.state.nameSearchVal.toLowerCase(),
            type: this.state.typeSearchVal.toLowerCase(),
          },
        })
        .then((res) => {
          let data = res.data;
          data = getVoteTotal(res.data);
          this.setState({ data });
        });
    }
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const resources = [...this.props.resources];
    console.log(this.state);
    const {
      open,
      column,
      nameSearchVal,
      typeSearchVal,
      direction,
      namePopupOpen,
      typePopupOpen,
    } = this.state;

    return (
      <>
        <style>{mediaStyles}</style>
        <MediaContextProvider>
          <Grid.Column as={Media} at="mobile">
            <Table
              style={{ marginBottom: "40px" }}
              unstackable
              sortable
              striped
              compact
              fixed
            >
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
                            ? 5
                            : 6
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
          </Grid.Column>
          {/* RENDER FOR TABLET OR GREATER */}
          <Grid.Column as={Media} greaterThanOrEqual="tablet">
            <Table
              style={{ marginBottom: "10px" }}
              unstackable
              // sortable
              striped
              compact
            >
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell
                    sorted={column === "name" ? direction : null}
                  >
                    <IconForResourceList
                      selected={column == "name"}
                      direction={direction}
                    />
                    <p
                      className="headerLabel"
                      onClick={this.handleSort("name")}
                      style={{ padding: 0, margin: 0 }}
                    >
                      Name
                    </p>
                    <div
                      style={{
                        width: "100%",
                        minHeight: "1.5em",
                        borderBottom: "1px solid black",
                      }}
                    >
                      <Popup
                        wide="very"
                        open={namePopupOpen}
                        position="bottom right"
                        onOpen={() => this.handlePopup("namePopupOpen", "open")}
                        trigger={
                          <div
                            style={{
                              width: "100%",
                              height: "1.5em",
                              display: "flex",
                              justifyContent: "space-between",
                              alignContent: "flex-end",
                            }}
                          >
                            <span>{nameSearchVal}</span>
                            {nameSearchVal.length > 0 ? (
                              <Icon
                                name="delete"
                                size="small"
                                style={{ float: "right" }}
                                onClick={() =>
                                  setTimeout(() => {
                                    this.setState({
                                      namePopupOpen: false,
                                      nameSearchVal: "",
                                      data: resources,
                                    });
                                  }, 0)
                                }
                              />
                            ) : null}
                          </div>
                        }
                        content={
                          <>
                            <Input
                              style={{
                                appearance: "none",
                                width: "70%",
                                display: "inline-block",
                              }}
                              name="nameSearchVal"
                              value={nameSearchVal}
                              onChange={this.onChange}
                            />

                            <Button
                              color="green"
                              size="tiny"
                              onClick={() =>
                                this.handlePopup("namePopupOpen", "close")
                              }
                              style={{
                                display: "inline-block",
                                marginLeft: "10px",
                              }}
                            >
                              Ok
                            </Button>
                          </>
                        }
                        on={["click"]}
                      />
                    </div>
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    // textAlign="center"
                    sorted={column === "type" ? direction : null}
                  >
                    <IconForResourceList
                      selected={column == "type"}
                      direction={direction}
                    />
                    <p
                      className="headerLabel"
                      onClick={this.handleSort("type")}
                      style={{ padding: 0, margin: 0 }}
                    >
                      Type
                    </p>

                    <Popup
                      wide="very"
                      open={typePopupOpen}
                      onOpen={() => this.handlePopup("typePopupOpen", "open")}
                      position="bottom right"
                      trigger={
                        <div
                          style={{
                            width: "100%",
                            minHeight: "1.5em",
                            borderBottom: "1px solid black",
                          }}
                        >
                          {typeSearchVal}
                        </div>
                      }
                      content={
                        <>
                          <Input
                            style={{
                              appearance: "none",
                              width: "70%",
                              display: "inline-block",
                            }}
                            name="typeSearchVal"
                            value={typeSearchVal}
                            onChange={this.onChange}
                          />
                          <Button
                            color="green"
                            size="tiny"
                            onClick={() =>
                              this.handlePopup("typePopupOpen", "close")
                            }
                            style={{
                              display: "inline-block",
                              marginLeft: "10px",
                            }}
                          >
                            Ok
                          </Button>
                        </>
                      }
                      on={["click"]}
                    />
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    textAlign="center"
                    sorted={column === "voteTotal" ? direction : null}
                  >
                    <IconForResourceList
                      selected={column == "voteTotal"}
                      direction={direction}
                    />
                    <p
                      className="headerLabel"
                      onClick={this.handleSort("voteTotal")}
                      style={{ padding: 0, margin: 0 }}
                    >
                      Votes
                    </p>
                    <div
                      style={{
                        width: "100%",
                        minHeight: "1.5em",
                      }}
                    ></div>
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    textAlign="center"
                    sorted={column === "created_at" ? direction : null}
                  >
                    <IconForResourceList
                      selected={column == "created_at"}
                      direction={direction}
                    />
                    <p
                      className="headerLabel"
                      onClick={this.handleSort("created_at")}
                      style={{ padding: 0, margin: 0 }}
                    >
                      Date Added
                    </p>
                    <div
                      style={{
                        width: "100%",
                        minHeight: "1.5em",
                      }}
                    ></div>
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
                            ? 5
                            : 6
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
          </Grid.Column>
        </MediaContextProvider>
      </>
    );
  }
}
function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps)(ResourceList);
