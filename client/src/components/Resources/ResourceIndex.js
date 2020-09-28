//ResourceIndex displays breadcrumb,
//header with matching unit name, and ResourceList
//where table of unit actually is located

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Header, Breadcrumb, Loader, Dimmer } from "semantic-ui-react";
import ResourceList from "./ResourceList/ResourceList";
import unitFields from "./data/unitFields.js";
import axios from "axios";
import NotLoggedIn from "../NotLoggedIn";
import { connect } from "react-redux";
import getVoteTotal from "./getVoteTotal";

class ResourceIndex extends Component {
  constructor(props) {
    super();
    this.state = {
      resources: [],
      loading: true,
    };
  }
  componentDidMount() {
    //set Resources
    if (this.props.match.params.unit) {
      axios.get(`/api/units/${this.props.match.params.unit}`).then((res) => {
        let resources = res.data;

        resources = getVoteTotal(resources);

        this.setState({
          resources,
          loading: false,
        });
      });
    }
  }

  getUnitName() {
    const route_state = this.props?.location?.state;
    if (route_state) {
      var { subject } = route_state;
    } else {
      var subject = "math";
    }
    const paramName = this.props.match.params.unit;
    for (let i = 0; i < unitFields[subject].length; i++) {
      if (unitFields[subject][i].param === paramName) {
        return unitFields[subject][i].key;
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
        callback(null, updated_resources);
      })
      .catch((err) => {
        callback(err);
      });
  };

  render() {
    //console.log(this.state, this.props);
    const UnitName = this.getUnitName();
    return (
      <div>
        <Breadcrumb>
          <Breadcrumb.Section>
            <Link to="/">Home</Link>
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section>
            <Link
              to={`/units?subject=${
                this.props?.location?.state?.subject || "math"
              }`}
            >
              Resources
            </Link>
          </Breadcrumb.Section>
          <Breadcrumb.Divider />
          <Breadcrumb.Section active>{UnitName}</Breadcrumb.Section>
        </Breadcrumb>
        <Header as="h3" dividing block>
          {UnitName}
        </Header>
        <div>
          {this.props.auth && !this.state.loading ? (
            <ResourceList
              param={this.props.match.params.unit}
              unit={this.props.match?.params?.unit}
              resources={this.state.resources}
              onDeleteResource={this.onDeleteResource}
              fetchCart={this.props.fetchCart}
            />
          ) : this.props.auth ? (
            <Dimmer active inverted style={{ height: "60vh" }}>
              <Loader size="massive">Loading</Loader>
            </Dimmer>
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
