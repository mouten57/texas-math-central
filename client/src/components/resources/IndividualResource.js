import React, { Component } from "react";
import { NotificationManager } from "react-notifications";
import { Container, Loader, Button, Icon, Image } from "semantic-ui-react";
import _ from "lodash";
import axios from "axios";
//import Voting from '../Voting';
import { connect } from "react-redux";
import CommentsSection from "../Comments/CommentsSection";
import "react-notifications/lib/notifications.css";
import "./style/IndividualResource.css";

class IndividualResource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: {},
      s3Link: null,
      resource_name: null,
      resource_id: null,
      resourceComments: [],
      currentUsersFavoriteId: "",
      favorited: false,
      commentValue: "",
      voteTotal: 0,
      upvoted: false,
      downvoted: false,
    };
  }

  componentDidMount = () => {
    this.makeAxiosCalls();
    if (this.props.history.location.state) {
      this.createNotification("success");
      //clear out state so notification doesn't keep going on componentDidMount
      this.props.history.push({
        state: null,
      });
    }
    this.setState({ selectedFile: this.state.files });
  };
  //is there a way to populate resource with one call rather than 3 separate calls?
  makeAxiosCalls = (nextProps) => {
    axios
      .get(
        `/api/units/${this.props.match.params.unit}/${this.props.match.params.id}`
      )
      .then((res) => {
        const resource = res.data;
        if (this.props.auth == undefined) {
          const currentUsersFavoriteId = resource.favorites.find((favorite) => {
            return favorite._user == nextProps.auth._id;
          })?._id;
          this.setState({ currentUsersFavoriteId });
        } else {
          const currentUsersFavoriteId = resource.favorites.find((favorite) => {
            return favorite._user == this.props.auth._id;
          })?._id;
          this.setState({ currentUsersFavoriteId });
        }

        this.setState({
          resource,
          selectedFile: resource.files[0],
          resourceComments: resource.comments,
          s3Link: resource.s3Link,
          resource_name: resource.name,
          resource_id: resource._id,
        });
        if (resource.votes.length > 0) {
          this.getVoteTotal(resource.votes);
        }
      });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.auth == undefined) {
      this.makeAxiosCalls(nextProps);
    }
  }

  getFavoriteFor = (userId) => {
    return this.state.resource.favorites.find((favorite) => {
      return favorite._user == userId;
    });
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
  };

  downloadLink() {
    switch (this.state.resource.files?.length) {
      case null:
        return "";
      case 0:
        return "Download not available.";
      default:
        return this.state.resource.files?.map((file, i) => {
          //use this if storing/downloading files directly from mongo db
          //let link = `/api/units/${this.props.match.params.unit}/${this.props.match.params.id}/download/${file.filename}`;
          //use this with s3
          let link = file.s3Link;
          return (
            <span
              key={i}
              className="file_selector"
              onClick={() => this.setState({ selectedFile: file })}
            >
              {/* <a href={link} download key={i} style={{ marginLeft: "5px" }}> */}
              {file.originalname}
              {/* </a> */}
              {i != this.state.resource.files.length - 1 ? ", " : null}
            </span>
          );
        });
    }
  }

  onUpvote = (e) => {
    axios
      .get(`/api/resources/${this.state.resource_id}/votes/upvote`)
      .then((res) => {
        if (!this.state.upvoted) {
          this.setState({
            voteTotal: this.state.voteTotal + res.data.value,
            upvoted: true,
            downvoted: false,
          });
        }
      });
  };
  onDownvote = (e) => {
    axios
      .get(`/api/resources/${this.state.resource_id}/votes/downvote`)
      .then((res) => {
        if (!this.state.downvoted) {
          this.setState({
            voteTotal: this.state.voteTotal + res.data.value,
            downvoted: true,
            upvoted: false,
          });
        }
      });
  };
  createNotification = (type) => {
    switch (type) {
      case "add_fav":
        NotificationManager.success("", "Added to favorites!", 1500);
        break;
      case "remove_fav":
        NotificationManager.warning("", "Removed from favorites", 1500);
        break;
      case "success":
        NotificationManager.success("Success!", "", 1500);
        break;
      case "warning":
        NotificationManager.warning(
          "Warning message",
          "Close after 3000ms",
          3000
        );
        break;
      case "error":
        NotificationManager.error("Error message", "Click me!", 5000, () => {
          alert("callback");
        });
        break;
      default:
        break;
    }
  };

  onAddToFavorites = () => {
    this.createNotification("add_fav");
    axios
      .post(`/api/resources/${this.state.resource_id}/favorites/create`)
      .then((res) => {
        this.setState({
          currentUsersFavoriteId: res.data._id,
        });
      });
  };
  onRemoveFromFavorites = () => {
    this.createNotification("remove_fav");
    axios.post(
      `/api/resources/${this.state.resource_id}/favorites/${this.state.currentUsersFavoriteId}/destroy`
    );
    this.setState({ currentUsersFavoriteId: "" });
  };

  render() {
    console.log(this.state);
    const { resource, favorited } = this.state;

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
              name={this.state.currentUsersFavoriteId ? "star" : "star outline"}
            />
          </Button>
          <Button onClick={(e) => this.onUpvote(e)}>&#9650;</Button>
          <Button basic>{this.state.voteTotal}</Button>
          <Button onClick={(e) => this.onDownvote(e)}>&#9660;</Button>
        </Button.Group>

        <h2>"{this.state.resource_name}"</h2>

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
          <p>
            <b>
              Files{" "}
              {this.state.resource.files?.length > 0
                ? " (click to preview)"
                : null}
              :{" "}
            </b>{" "}
            {this.downloadLink()}
          </p>
          <p>
            <b>
              Preview
              {this.state.selectedFile
                ? ` (${this.state.selectedFile.originalname})`
                : ""}
              :
            </b>{" "}
            {this.state.selectedFile ? (
              <a href={this.state.selectedFile.s3Link}>
                <Image
                  src={this.state.selectedFile.s3Link}
                  bordered
                  size="huge"
                />
              </a>
            ) : (
              "No Preview Available"
            )}
          </p>
        </div>

        {this.state.isLoading ? (
          <Loader active inline="centered" />
        ) : (
          <CommentsSection
            resourceId={this.props.match.params.id}
            comments={this.state.resourceComments}
          />
        )}
      </Container>
    );
  }
}
function mapStateToProps(state) {
  console.log("mapping state to props");
  return { auth: state.auth };
}
export default connect(mapStateToProps)(IndividualResource);
