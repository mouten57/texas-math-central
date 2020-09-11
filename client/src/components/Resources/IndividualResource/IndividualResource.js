import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import createNotification from "../Notification";
import {
  Container,
  Loader,
  Button,
  Icon,
  Image,
  Popup,
} from "semantic-ui-react";
import downloadLink from "./downloadLink";
import RenderCartOptions from "./RenderCartOptions";

import axios from "axios";
//import Voting from '../Voting';
import { connect } from "react-redux";
import CommentsSection from "../../Comments/CommentsSection";
import "react-notifications/lib/notifications.css";
import "./IndividualResource.css";
import img from "../../../images/sample_doc.png";
import EditResource from "../EditResource/EditResource";
import Modal from "../../Modal";

class IndividualResource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: {},
      edit: false,
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
    const { history } = this.props;
    let link_props = this.props.history.location?.state;
    //set up socket
    this.props.socket.on(
      "updated-resource-post-upload",
      this.updateResourcePostUpload
    );
    //coming after a create?
    if (link_props?.new_create_data && !this.state.post_create_complete) {
      console.log("POST CREATE");
      //then launch 'success'
      createNotification("success");
      //clear out state so notification doesn't keep going on componentDidMount
      this.setState({ post_create_complete: true });
      this.makeAxiosCalls();
      //clear history
      history.replace();
      //coming from unit resources
    } else if (link_props?.unitResources) {
      console.log("COMING FROM UNIT RESOURCES");
      const this_resource = link_props.unitResources.find(
        (el) => el._id == this.props.match.params.id
      );
      this.finishUpSetup(this_resource);
      //clear out history
      history.replace();
    } else if (link_props?.profileResource) {
      this.finishUpSetup(link_props.profileResource);
    } else {
      this.makeAxiosCalls();
    }
  };

  componentDidUpdate = (prevProps, prevState) => {
    console.log("update");
    // console.log(
    //   prevState.resource,
    //   "prevState",
    //   prevState.currentUsersFavoriteId,
    //   "state",
    //   this.state.currentUsersFavoriteId
    // );
    if (
      prevState.resource._id &&
      prevState.currentUsersFavoriteId != this.state.currentUsersFavoriteId
    ) {
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
    axios
      .get(
        `/api/units/${this.props.match.params.unit}/${this.props.match.params.id}`
      )
      .then((res) => {
        const resource = res.data;
        this.finishUpSetup(resource);
      });
  };

  finishUpSetup = (resource) => {
    var currentUsersFavoriteId = resource.favorites.find((favorite) => {
      return favorite._user == this.props.auth?._id;
    })?._id;
    if (currentUsersFavoriteId == undefined) currentUsersFavoriteId = "";

    //set if item is in cart
    this.is_item_in_cart(resource._id);

    this.setState({
      resource,
      currentUsersFavoriteId,
      selectedFile: this.state.files ? this.state.files[0] : null,
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
  };

  getFavoriteFor = (userId) => {
    let result = this.state.resource.favorites?.find((favorite) => {
      return favorite._user == userId;
    });
    return result ? true : false;
  };
  is_item_in_cart = (resource_id) => {
    if (this.props.cart) {
      let result = this.props.cart.products.find((product) => {
        return product.resource_id?._id == resource_id;
      });
      this.setState({ item_in_cart: result ? true : false });
    }
  };

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

  onUpvoteDownvote = (action) => {
    axios
      .get(`/api/resources/${this.state.resource_id}/votes/${action}`)
      .then(({ data }) => {
        let value = data.value;
        let votes = this.state.votes;

        let objIndex = votes.findIndex(
          (obj) => obj._user == this.props.auth._id
        );

        if (objIndex > -1) {
          console.log("-1");
          votes[objIndex].value = action == "upvote" ? 1 : -1;
        } else {
          console.log(objIndex);
          votes.push(data);
        }
        this.getVoteTotal(votes);

        this.setState({
          upvoted: action == "upvote" ? true : false,
          downvoted: action == "upvote" ? false : true,
        });
      });
  };
  onAddRemoveFavorite = (action) => {
    let link =
      action == "add"
        ? "create"
        : `${this.state.currentUsersFavoriteId}/destroy`;

    createNotification(action == "add" ? "add_fav" : "remove_fav");
    axios
      .post(`/api/resources/${this.state.resource_id}/favorites/${link}`)
      .then((res) => {
        this.setState({
          currentUsersFavoriteId: action == "add" ? res.data._id || "" : "",
        });
      })
      .catch((err) => {
        throw err;
      });
  };

  onAddRemoveCart = (resourceId, action) => {
    createNotification(action == "add" ? "add_to_cart" : "remove_from_cart");
    axios
      .post(`/api/cart/${resourceId}/${action}`)
      .then((response) => {
        this.setState({ item_in_cart: action == "add" ? true : false });
        this.props.fetchCart();
      })
      .catch((err) => console.log(err));
  };

  editItemHandler = (_id) => {
    axios
      .get(`/api/resources/${_id}/edit`)
      .then((res) => {
        this.setState({ editData: res.data, edit: true });
      })
      .catch((err) => console.log(err));
  };

  onSubmitUpdate = (resource) => {
    axios
      .post(`/api/resources/${resource._id}/update`, resource)
      .then((res) => {
        this.setState({ resource: res.data, edit: false });
      });
  };

  onDelete = () => {
    const { unit, _id } = this.state.resource;
    axios
      .post(`/api/units/${unit}/${_id}/delete`)
      .then((res) => {
        console.log(res.data);
        this.props.history.push({
          pathname: `/units/${unit}`,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    console.log("state is", this.state, "props are", this.props);
    const { resource } = this.state;
    if (
      resource._user?._id == this.props.auth?._id ||
      this.props.auth?.purchasedResources.includes(resource._id) ||
      this.props.auth?.role == "admin" ||
      this.props.auth?.role == "all_access"
    ) {
      var authorized = true;
    }

    return (
      <Container>
        <Button.Group vertical icon size="small" floated="right">
          <Button
            style={{ marginBottom: "10px" }}
            icon
            compact
            basic
            onClick={() =>
              this.state.currentUsersFavoriteId
                ? this.onAddRemoveFavorite("remove")
                : this.onAddRemoveFavorite("add")
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
          <Button
            basic
            icon
            style={{ marginBottom: "10px" }}
            onClick={() => this.editItemHandler(this.state.resource._id)}
          >
            <Icon size="large" name="edit" />
          </Button>
          <Button basic icon onClick={this.onDelete}>
            <Icon size="large" name="trash alternate outline" />
          </Button>
        </Button.Group>
        <Button.Group
          vertical
          icon
          size="small"
          floated="right"
          style={{ marginTop: "15px" }}
        >
          <Button onClick={(e) => this.onUpvoteDownvote("upvote")}>
            &#9650;
          </Button>
          <Button basic>{this.state.voteTotal}</Button>
          <Button onClick={(e) => this.onUpvoteDownvote("downvote")}>
            &#9660;
          </Button>
        </Button.Group>

        <h2>"{resource.name}" </h2>

        <RenderCartOptions
          onAddRemoveCart={this.onAddRemoveCart}
          resource={resource}
          auth={this.props.auth}
          state={this.state}
        />

        <div>
          <p>
            <b>Name: </b>
            {resource.name}
          </p>

          <p>
            <b>Grade Level: </b>
            {resource.grade}
          </p>

          <p>
            <b>Subject: </b>
            {resource.subject}
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
            {downloadLink(this.state, (err, selectedFile) => {
              this.setState({ selectedFile });
            })}
          </div>

          {this.state.selectedFile ? (
            this.state.selectedFile == "TBD" ? null : (
              <p>
                <b>
                  Preview
                  {` (${this.state.selectedFile.originalname})`}
                </b>

                <a href={authorized ? this.state.selectedFile.s3Link : null}>
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

        {!this.state.resource ? (
          <Loader active inline="centered" />
        ) : (
          <CommentsSection
            resourceId={this.props.match.params.id}
            comments={this.state.comments}
          />
        )}
        {this.state.edit ? (
          <Modal open={this.state.edit} header="Edit">
            <EditResource
              editData={this.state.editData}
              editResource={this.state.edit}
              updateResource={this.onSubmitUpdate}
              cancelEdit={(e) =>
                this.setState({
                  edit: !this.state.edit,
                })
              }
            />
          </Modal>
        ) : null}
      </Container>
    );
  }
}
const mapStateToProps = (state) => {
  return { auth: state.auth, cart: state.cart };
};
export default connect(mapStateToProps)(IndividualResource);
