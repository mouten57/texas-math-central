//UnitIndex displays the table of all available
//TOPICS, like B.O.Y., Addition/Mult, APV, etc.

import _ from "lodash";
import React, { Component } from "react";
import { Table, Breadcrumb, Container, Icon } from "semantic-ui-react";
import unitFields from "./data/unitFields.js";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Search from "../Search/Search";

class Units extends Component {
  state = {
    column: null,
    data: [],
    direction: null,
    units: [],
    subject: "math",
  };

  componentDidMount() {
    const subject =
      new URLSearchParams(this.props.location.search).get("subject") ||
      this.state.subject;

    this.setState({
      subject,
      data: unitFields[subject],
    });
  }
  componentDidUpdate(prevProps, prevState) {
    const subject =
      new URLSearchParams(this.props.location.search).get("subject") ||
      this.state.subject;
    if (prevState.subject != subject) {
      this.setState({
        subject,
        data: unitFields[subject],
      });
    }
  }
  handleSort = (clickedColumn) => () => {
    const { column, data, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: "ascending",
      });
      return;
    }

    this.setState({
      data: data.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending",
    });
  };

  render() {
    //console.log(this.state);
    const { column, data, direction, subject } = this.state;
    const { auth } = this.props;
    return (
      <Container>
        <Breadcrumb>
          <Breadcrumb.Section>
            <Link to="/">Home</Link>
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section active>
            Resources ({subject.charAt(0).toUpperCase() + subject.slice(1)})
          </Breadcrumb.Section>
        </Breadcrumb>
        <div
          style={{
            marginTop: "15px",
            marginBottom: "15px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <h2 style={{ display: "inline", margin: 0 }}>UNITS</h2>
          <Search
            resources={this.props.resources}
            subject={this.state.subject}
          />
        </div>
        {auth && auth?.role != "admin" && auth?.role != "all_access" ? (
          <p style={{ marginBottom: "25px" }}>
            Get your <Link to="/upgrade">ALL-ACCESS PASS</Link> TODAY!{" "}
          </p>
        ) : null}
        <Table sortable celled striped compact style={{ marginBottom: "10px" }}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === "name" ? direction : null}
                onClick={this.handleSort("name")}
              >
                Unit
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === "description" ? direction : null}
                onClick={this.handleSort("description")}
              >
                Description
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(data, ({ key, description, param }) => (
              <Table.Row key={key}>
                <Table.Cell width={5}>{key}</Table.Cell>
                <Table.Cell width={11}>
                  {" "}
                  <Link
                    to={{
                      pathname: `/units/${param}`,
                      state: { subject },
                    }}
                  >
                    {" "}
                    {description}{" "}
                  </Link>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
        <p style={{ marginBottom: "40px" }}>
          Want to contribute something new?{" "}
          <a href="resources/new">
            <Icon name="add" color="black" />
          </a>
        </p>
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return { auth: state.auth, resources: state.resources };
}

export default connect(mapStateToProps)(Units);
