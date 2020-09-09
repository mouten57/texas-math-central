import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Image,
  Dimmer,
  Header,
  Container,
  List,
  Segment,
  Loader,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import NotLoggedIn from "./NotLoggedIn";
import axios from "axios";
import convertTimestamp from "../helpers/convertTimestamp";
import Upgrade from "./UpgradeAllAccess";

class UserProfile extends Component {
  state = {
    activeItem: "",
    visible: false,
    comments: [],
    resources: [],
    favorites: [],
    loading: true,
  };

  componentDidMount() {
    axios.get("/api/profile").then((res) => {
      this.setState({
        comments: res.data.comments,
        resources: res.data.resources,
        favorites: res.data.favorites,
        purchased: res.data.user.purchasedResources,
      });
      this.setState({ loading: false });
    });
  }

  renderHeading() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return <NotLoggedIn />;
      default:
        return (
          <Segment color="blue">
            <Header as="h1" textAlign="center">
              <Image size="massive" circular src={this.props.auth.image} />
              <p>
                {this.props.auth.nickname}'s Profile{" "}
                {this.props.auth.role == "admin"
                  ? "(admin)"
                  : this.props.auth.role == "all_access"
                  ? "(ALL ACCESS!)"
                  : null}
              </p>
            </Header>
            {this.props.auth.role != "admin" &&
            this.props.auth.role != "all_access" ? (
              <p>
                Feel like getting <Link to="/upgrade">all access</Link>?
              </p>
            ) : this.props.auth.role == "all_access" ? (
              <p style={{ textAlign: "center" }}>
                Congrats! You can now download any resource by viewing them
                through the <Link to="/units">Units</Link> page.
              </p>
            ) : null}
          </Segment>
        );
    }
  }

  renderComments() {
    switch (this.state.comments) {
      case null:
        return;
      case false:
        return <p />;
      default:
        this.state.comments.map((comment) => {
          return <p>{comment.body}</p>;
        });
    }
  }

  render() {
    console.log();
    return (
      <Container style={{ marginBottom: "40px" }}>
        {this.renderHeading()}
        {this.state.loading ? (
          <Dimmer active inverted style={{ height: "60vh" }}>
            <Loader size="massive">Loading</Loader>
          </Dimmer>
        ) : (
          <>
            <Header as="h2" dividing>
              My Resources
            </Header>
            <div>
              {this.state.resources?.map((resource) => {
                return (
                  <div key={resource._id}>
                    <List.Icon name="file" />
                    <Link
                      style={{ color: "#858DAA" }}
                      to={{
                        pathname: `/units/${resource.unit}/${resource._id}`,
                        state: { profileResource: resource },
                      }}
                    >
                      <h3 style={{ display: "inline-block", marginTop: "5px" }}>
                        "{resource.name}"
                      </h3>
                    </Link>
                  </div>
                );
              })}
            </div>

            <Header as="h2" dividing>
              My Comments
            </Header>
            <div>
              {this.state.comments?.map((comment) => {
                return (
                  <p key={comment._id}>
                    {comment.body} on {convertTimestamp(comment.created_at)}
                  </p>
                );
              })}
            </div>
            <Header as="h2" dividing>
              My Favorites
            </Header>
            <div>
              {this.state.favorites?.map((favorite) => {
                return (
                  <div key={favorite._id}>
                    <List.Icon name="file" />
                    <Link
                      style={{ color: "#858DAA" }}
                      to={`/units/${favorite.resource_id.unit}/${favorite.resource_id._id}`}
                    >
                      <h3 style={{ display: "inline-block", marginTop: "5px" }}>
                        "{favorite.resource_id.name}"
                      </h3>
                    </Link>
                  </div>
                );
              })}
            </div>
            <Header as="h2" dividing>
              My Purchases
            </Header>
            <div>
              {this.state.purchased?.map((resource) => {
                return (
                  <div key={resource._id}>
                    <List.Icon name="file" />
                    <Link
                      style={{ color: "#858DAA" }}
                      to={`/units/${resource.unit}/${resource._id}`}
                    >
                      <h3 style={{ display: "inline-block", marginTop: "5px" }}>
                        "{resource.name}"
                      </h3>
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Container>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(UserProfile);
