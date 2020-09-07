import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import createNotification from "./Notification";
import { Container, Loader, Button, Icon, Image } from "semantic-ui-react";

import axios from "axios";
//import Voting from '../Voting';
import { connect } from "react-redux";
import CommentsSection from "../Comments/CommentsSection";
import "react-notifications/lib/notifications.css";
import "./style/IndividualResource.css";
import img from "../../images/sample_doc.png";

class IndividualResource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: {},
      s3Link: null,
      resource_name: null,
      resource_id: null,
      comments: [],
      currentUsersFavoriteId: "",
      favorited: false,
      commentValue: "",
      votes: [],
      voteTotal: 0,
      upvoted: false,
      downvoted: false,
      item_in_cart: null,
    };

    this.updateResourcePostUpload = (resource) => {
      if (resource._id == this.props.match.params.id) {
        this.setState({
          resource,
          selectedFile: resource.files[0],
          comments: resource.comments,
          s3Link: resource.s3Link,
          resource_id: resource._id,
        });
      }
    };
  }

  componentDidMount = () => {
    this.props.socket.on(
      "updated-resource-post-upload",
      this.updateResourcePostUpload
    );
    this.makeAxiosCalls();
    if (this.props.history.location.state) {
      createNotification("success");
      //clear out state so notification doesn't keep going on componentDidMount
      this.props.history.push({
        state: null,
      });
    }
    this.setState({
      selectedFile: this.state.files ? this.state.files[0] : null,
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    console.log("update");
    if (
      prevState.resource._id &&
      prevState.currentUsersFavoriteId != this.state.currentUsersFavoriteId
    ) {
      console.log(
        prevState.resource,
        "prevState",
        prevState.currentUsersFavoriteId,
        "state",
        this.state.currentUsersFavoriteId
      );
      this.makeAxiosCalls();
    }
  };

  componentWillUnmount() {
    this.props.socket.off(
      "updated-resource-post-upload",
      this.updateResourcePostUpload
    );
  }

  makeAxiosCalls = () => {
    console.log("making axios calls");
    axios
      .get(
        `/api/units/${this.props.match.params.unit}/${this.props.match.params.id}`
      )
      .then((res) => {
        const resource = res.data;
        var currentUsersFavoriteId = resource.favorites.find((favorite) => {
          return favorite._user == this.props.auth?._id;
        })?._id;
        if (currentUsersFavoriteId == undefined) currentUsersFavoriteId = "";
        this.setState({ currentUsersFavoriteId });
        // }

        this.setState({
          resource,
          votes: resource.votes,
          selectedFile: resource.files[0],
          comments: resource.comments,
          s3Link: resource.s3Link,
          resource_name: resource.name,
          resource_id: resource._id,
        });
        if (resource.votes.length > 0) {
          this.getVoteTotal(resource.votes);
        }
      });
  };

  getFavoriteFor = (userId) => {
    let result = this.state.resource.favorites?.find((favorite) => {
      return favorite._user == userId;
    });
    return result ? true : false;
  };
  item_in_cart = (resource_id) => {
    if (this.props.cart) {
      let result = this.props.cart.products.find((product) => {
        return product.resource_id?._id == resource_id;
      });

      return result ? true : false;
    }
  };

  downloadLink() {
    switch (this.state.resource.files?.length) {
      case null:
        return "";
        break;
      case 0:
        return "Download not available.";
        break;
      case 1:
        //if index 0 of files is "TBD", that means we are still waiting for s3 upload to complete
        if (this.state.resource.files[0] == "TBD") {
          return (
            <Loader active inline="centered">
              Fetching a personal preview
            </Loader>
          );
          break;
        }

      default:
        return (
          <ul style={{ listStyle: "none", marginTop: "5px" }}>
            {this.state.resource.files?.map((file, i) => {
              //use this if storing/downloading files directly from mongo db
              //let link = `/api/units/${this.props.match.params.unit}/${this.props.match.params.id}/download/${file.filename}`;
              //use this with s3
              // let link = file.s3Link;
              return (
                <li
                  key={i}
                  className="file_selector"
                  onClick={() => this.setState({ selectedFile: file })}
                >
                  {file.originalname}
                </li>
              );
            })}
          </ul>
        );
    }
  }
  getVoteTotal = (votes) => {
    let voteTotal = votes
      .map((v) => {
        return v.value;
      })
      .reduce((prev, next) => {
        return prev + next;
      });
    //keeps state updated without calling to database

    this.setState({ voteTotal });
    return voteTotal;
  };

  onUpvote = (e) => {
    axios
      .get(`/api/resources/${this.state.resource_id}/votes/upvote`)
      .then(({ data }) => {
        let value = data.value;
        let votes = this.state.votes;

        let objIndex = votes.findIndex(
          (obj) => obj._user == this.props.auth._id
        );
        console.log(objIndex);
        if (objIndex > -1) {
          console.log(objIndex);
          votes[objIndex].value = 1;
        } else {
          votes.push(data);
        }
        this.getVoteTotal(votes);
        if (!this.state.upvoted) {
          this.setState({
            upvoted: true,
            downvoted: false,
          });
        }
      });
  };
  onDownvote = (e) => {
    axios
      .get(`/api/resources/${this.state.resource_id}/votes/downvote`)
      .then(({ data }) => {
        let value = data.value;
        let votes = this.state.votes;
        let objIndex = votes.findIndex(
          (obj) => obj._user == this.props.auth._id
        );
        if (objIndex > -1) {
          votes[objIndex].value = -1;
        } else {
          votes.push(data);
        }
        console.log(votes);
        this.getVoteTotal(votes);

        if (!this.state.downvoted) {
          this.setState({
            downvoted: true,
            upvoted: false,
          });
        }
      });
  };

  onAddToFavorites = () => {
    createNotification("add_fav");
    axios
      .post(`/api/resources/${this.state.resource_id}/favorites/create`)
      .then((res) => {
        this.setState({
          currentUsersFavoriteId: res.data._id || "",
        });
      });
  };
  onRemoveFromFavorites = () => {
    createNotification("remove_fav");
    axios
      .post(
        `/api/resources/${this.state.resource_id}/favorites/${this.state.currentUsersFavoriteId}/destroy`
      )
      .then((err, result) => {
        this.setState({ currentUsersFavoriteId: "" });
      })
      .catch((err) => {
        throw err;
      });
  };
  addToCart = (resourceId) => {
    createNotification("add_to_cart");
    axios
      .post(`/api/cart/${resourceId}/add`)
      .then((response) => {
        this.setState({ item_in_cart: true });
        this.props.fetchCart();
      })
      .catch((err) => console.log(err));
  };
  removeFromCart = (resourceId) => {
    createNotification("remove_from_cart");
    axios
      .post(`/api/cart/${resourceId}/remove`)
      .then((response) => {
        this.setState({ item_in_cart: false });
        this.props.fetchCart();
      })
      .catch((err) => console.log(err));
  };

  renderCartOptions = (resource) => {
    if (resource && this.props.auth && resource._user) {
      if (resource._user?._id == this.props.auth?._id) {
        return <p>My resource</p>;
      } else if (
        this.props.auth.role == "admin" ||
        this.props.auth.role == "all_access"
      ) {
        return <p>Premium User Access!</p>;
      } else if (this.props.auth?.purchasedResources.includes(resource._id)) {
        return <p>Purchased Item</p>;
      } else {
        return (
          <p
            className="add-to-cart"
            onClick={
              this.item_in_cart(resource._id)
                ? () => this.removeFromCart(resource._id)
                : () => this.addToCart(resource._id)
            }
          >
            <b style={{ backgroundColor: "yellow" }}>
              {this.item_in_cart(resource._id) ? "Remove from" : "Add to"} Cart
            </b>
          </p>
        );
      }
    }
  };
  render() {
    //console.log("state is", this.state, "props are", this.props);
    const { resource } = this.state;

    return (
      <Container>
        <Button.Group vertical size="small" floated="right">
          <Button
            style={{ marginBottom: "10px" }}
            icon
            basic
            onClick={
              this.state.currentUsersFavoriteId
                ? this.onRemoveFromFavorites
                : this.onAddToFavorites
            }
          >
            <Icon
              size="large"
              name={
                this.getFavoriteFor(this.props?.auth?._id)
                  ? "star"
                  : "star outline"
              }
            />
          </Button>
          <Button onClick={(e) => this.onUpvote(e)}>&#9650;</Button>
          <Button basic>{this.state.voteTotal}</Button>
          <Button onClick={(e) => this.onDownvote(e)}>&#9660;</Button>
        </Button.Group>

        <h2>"{resource.name}"</h2>

        {this.renderCartOptions(resource)}

        <div>
          <p>
            <b>Name: </b>
            {resource.name}
          </p>

          <p>
            <b>Unit:</b> {resource.fullUnit}
          </p>
          <p>
            <b>Type:</b> {resource.type}
          </p>
          <p>
            <b>Link: </b>{" "}
            <a href={resource.link} target="_blank" rel="noopener noreferrer">
              {resource.link}
            </a>
          </p>
          <p>
            {" "}
            <b>Uploader:</b> {resource._user ? resource._user.name : null}{" "}
          </p>
          <div>
            <b>
              Files{" "}
              {this.state.resource.files?.length > 0
                ? this.state.resource.files[0] == "TBD"
                  ? null
                  : " (click to preview)"
                : null}
              :{" "}
            </b>{" "}
            {this.downloadLink()}
          </div>

          {this.state.selectedFile ? (
            this.state.selectedFile == "TBD" ? null : (
              <p>
                <b>
                  Preview
                  {` (${this.state.selectedFile.originalname})`}
                </b>

                <a
                  href={
                    resource._user?._id == this.props.auth?._id ||
                    this.props.auth?.purchasedResources.includes(
                      resource._id
                    ) ||
                    this.props.auth?.role == "admin"
                      ? this.state.selectedFile.s3Link
                      : null
                  }
                >
                  <Image
                    src={
                      //use s3 direct link as src if file type is image
                      this.state.selectedFile?.mimetype?.includes("image")
                        ? this.state.selectedFile.s3Link
                        : //else use the previewLink of the file
                        this.state.selectedFile.previewLink
                        ? this.state.selectedFile.previewLink
                        : //else use placeholder image
                          img
                    }
                    bordered
                    size="huge"
                    centered
                  />
                </a>
              </p>
            )
          ) : null}
        </div>

        {this.state.isLoading ? (
          <Loader active inline="centered" />
        ) : (
          <CommentsSection
            resourceId={this.props.match.params.id}
            comments={this.state.comments}
          />
        )}
      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  return { auth: state.auth, cart: state.cart };
};
export default connect(mapStateToProps)(IndividualResource);
