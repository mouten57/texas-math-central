import React, { Component } from "react";
import { createMedia } from "@artsy/fresnel";
import createNotification from "../Notification";
import {
  Container,
  Loader,
  Button,
  Icon,
  Grid,
  Image,
  Confirm,
} from "semantic-ui-react";

import MainGrid from "./MainGrid";
import RightButtons from "./RightButtons";
import axios from "axios";
//import Voting from '../Voting';
import { connect } from "react-redux";
import CommentsSection from "../../Comments/CommentsSection";
import "react-notifications/lib/notifications.css";
import "./IndividualResource.css";

import EditResource from "../EditResource/EditResource";
import Modal from "../../Modal";

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

class IndividualResource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: {},
      confirmOpen: false,
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
      //then launch 'success'
      createNotification("success");
      //clear out state so notification doesn't keep going on componentDidMount
      this.setState({ post_create_complete: true });
      this.makeAxiosCalls();
      //clear history
      history.replace();
      //coming from unit resources
    } else if (link_props?.unitResources) {
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
    if (resource == "") {
      return this.props.history.push(`/units`);
    }
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
      free: resource.free,
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
    if (this.props.cart?.products?.length) {
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
          votes[objIndex].value = action == "upvote" ? 1 : -1;
        } else {
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

  show = (resource) => this.setState({ confirmOpen: true });

  handleConfirmDelete = () => {
    const { unit, _id } = this.state.resource;
    axios
      .post(`/api/units/${unit}/${_id}/delete`)
      .then((res) => {
        this.setState({ confirmOpen: false });
        this.props.fetchCart();
        this.props.history.push({
          pathname: `/units/${unit}`,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  handleCancelDelete = () => this.setState({ confirmOpen: false });

  render() {
    //console.log("state is", this.state, "props are", this.props);
    const { resource, confirmOpen } = this.state;
    if (this.props.auth) {
      if (
        this.props.auth?.role == "all_access" ||
        this.props.auth?.purchasedResources.includes(resource._id) ||
        resource._user?._id == this.props.auth?._id ||
        this.props.auth?.role == "admin" ||
        this.state.free
      ) {
        var authorized_to_view = true;
      }
      if (
        resource._user?._id == this.props.auth?._id ||
        this.props.auth?.role == "admin"
      ) {
        var authorized_to_delete = true;
      }
    }

    return (
      <>
        <style>{mediaStyles}</style>
        <MediaContextProvider>
          <Grid>
            {/* Grid on phone */}
            <Grid.Column as={Media} at="mobile" width={10}>
              <MainGrid
                selectedFile={this.state.selectedFile}
                leftColWidth={16}
                rightColWidth={16}
                iframeheight="400px"
                iframewidth="85vw"
                resource={resource}
                setSelectedFile={(selectedFile) =>
                  this.setState({ selectedFile })
                }
                authorized_to_view={authorized_to_view}
                onAddRemoveCart={this.onAddRemoveCart}
                auth={this.props.auth}
                state={this.state}
              />
            </Grid.Column>

            {/* Grid on tablet and up */}
            <Grid.Column as={Media} greaterThanOrEqual="tablet" width={14}>
              <MainGrid
                selectedFile={this.state.selectedFile}
                leftColWidth={5}
                rightColWidth={11}
                iframeheight="400px"
                iframewidth="100%"
                resource={resource}
                setSelectedFile={(selectedFile) =>
                  this.setState({ selectedFile })
                }
                authorized_to_view={authorized_to_view}
                onAddRemoveCart={this.onAddRemoveCart}
                auth={this.props.auth}
                state={this.state}
              />
            </Grid.Column>

            {/* Buttons on phone */}
            <Grid.Column width={6} as={Media} at="mobile">
              {authorized_to_delete ? (
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
                    onClick={() =>
                      this.editItemHandler(this.state.resource._id)
                    }
                  >
                    <Icon size="large" name="edit" />
                  </Button>
                  <Button basic icon onClick={this.show}>
                    <Icon size="large" name="trash alternate outline" />
                  </Button>
                </Button.Group>
              ) : null}
              <RightButtons
                auth={this.props.auth}
                onAddRemoveFavorite={this.onAddRemoveFavorite}
                authorized_to_delete={authorized_to_delete}
                currentUsersFavoriteId={this.state.currentUsersFavoriteId}
                getFavoriteFor={this.getFavoriteFor}
                voteTotal={this.state.voteTotal}
                onUpvoteDownvote={this.onUpvoteDownvote}
              />
            </Grid.Column>
            {/* Buttons on tablet and up */}
            <Grid.Column width={2} as={Media} greaterThanOrEqual="tablet">
              {authorized_to_delete ? (
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
                    onClick={() =>
                      this.editItemHandler(this.state.resource._id)
                    }
                  >
                    <Icon size="large" name="edit" />
                  </Button>
                  <Button basic icon onClick={this.show}>
                    <Icon size="large" name="trash alternate outline" />
                  </Button>
                </Button.Group>
              ) : null}
              <RightButtons
                auth={this.props.auth}
                onAddRemoveFavorite={this.onAddRemoveFavorite}
                authorized_to_delete={authorized_to_delete}
                currentUsersFavoriteId={this.state.currentUsersFavoriteId}
                getFavoriteFor={this.getFavoriteFor}
                voteTotal={this.state.voteTotal}
                onUpvoteDownvote={this.onUpvoteDownvote}
              />
            </Grid.Column>

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
                  role={this.props.auth.role}
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
            <Confirm
              open={confirmOpen}
              size="tiny"
              cancelButton="Cancel"
              confirmButton="Delete Resource"
              onCancel={this.handleCancelDelete}
              onConfirm={this.handleConfirmDelete}
            />
          </Grid>
        </MediaContextProvider>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return { auth: state.auth, cart: state.cart };
};
export default connect(mapStateToProps)(IndividualResource);
