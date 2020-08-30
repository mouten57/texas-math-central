//ResourceIndex displays breadcrumb,
//header with matching unit name, and ResourceList
//where table of unit actually is located

import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Header,
  Breadcrumb,
  Container,
  Loader,
  Segment,
  Dimmer,
  Image,
} from "semantic-ui-react";
import ResourceList from "./ResourceList";
import unitFields from "./data/unitFields.js";
import axios from "axios";
import NotLoggedIn from "../NotLoggedIn";
import { connect } from "react-redux";

class ResourceIndex extends Component {
  constructor(props) {
    super();
    this.state = {
      resources: [],
    };
  }
  componentDidMount() {
    //set Resources
    axios.get(`/api/units/${this.props.match.params.unit}`).then((res) => {
      const resources = res.data;
      this.setState({
        resources,
      });
    });
  }

  getUnitName() {
    const paramName = this.props.match.params.unit;
    for (let i = 0; i < unitFields.length; i++) {
      if (unitFields[i].param === paramName) {
        return unitFields[i].name;
      }
    }
  }
  onDeleteResource = (resourceId, callback) => {
    axios
      .post(`/api/units/${this.props.match.params.unit}/${resourceId}/delete`)
      .then((res) => {
        let updated_resources = this.state.resources.filter(function (el) {
          return el._id !== resourceId;
        });
        this.setState({ resources: updated_resources });
        callback(null, res.data);
      })
      .catch((err) => {
        callback(err);
      });
  };

  render() {
    const UnitName = this.getUnitName();
    return (
      <Container>
        <Breadcrumb>
          <Breadcrumb.Section>
            <Link to="/">Home</Link>
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section>
            <Link to="/units">Resources</Link>
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section active>{UnitName}</Breadcrumb.Section>
        </Breadcrumb>
        <Header as="h3" dividing block>
          {UnitName}
        </Header>
        <Container>
          {this.props.auth && this.state.resources ? (
            <ResourceList
              auth={this.props.auth}
              param={this.props.match.params.unit}
              resources={this.state.resources}
              onDeleteResource={this.onDeleteResource}
            />
          ) : this.props.auth ? (
            <Segment>
              <Dimmer active>
                <Loader>Loading</Loader>
              </Dimmer>

              <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
            </Segment>
          ) : (
            <NotLoggedIn />
          )}
        </Container>
      </Container>
    );
  }
}
function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(mapStateToProps)(ResourceIndex);
