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
      const myFunc = (acc, curr) => {
        return Number(acc.value) + Number(curr.value);
      };

      for (let i in resources) {
        if (resources[i].votes.length == 1 && resources[i].votes.length) {
          var voteTotal = resources[i].votes[0].value;
        } else if (resources[i].votes.length > 1) {
          var voteTotal = resources[i].votes.reduce(myFunc);
        } else {
          var voteTotal = 0;
        }
        resources[i].voteTotal = voteTotal;
      }
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
    console.log(this.state);
    const UnitName = this.getUnitName();
    return (
      <div>
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
        <div>
          {this.props.auth && this.state.resources ? (
            <ResourceList
              param={this.props.match.params.unit}
              resources={this.state.resources}
              onDeleteResource={this.onDeleteResource}
              fetchCart={this.props.fetchCart}
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
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(mapStateToProps)(ResourceIndex);
