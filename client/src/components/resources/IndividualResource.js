import React, { Component } from "react";
import { Container, Loader, Button } from "semantic-ui-react";
import _ from "lodash";
import axios from "axios";
//import Voting from '../Voting';
import { connect } from "react-redux";
import CommentsSection from "../Comments/CommentsSection";

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
          let link = `/api/units/${this.props.match.params.unit}/${this.props.match.params.id}/download/${file.filename}`;
          return (
            <span key={i}>
              <a href={link} download key={i} style={{ marginLeft: "5px" }}>
                {file.originalname}
              </a>
              {i != this.state.resource.files.length - 1 ? "," : null}
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
  onAddToFavorites = () => {
    axios
      .post(`/api/resources/${this.state.resource_id}/favorites/create`)
      .then((res) => {
        console.log(res.data);
        this.setState({
          currentUsersFavoriteId: res.data._id,
        });
      });
  };
  onRemoveFromFavorites = () => {
    axios.post(
      `/api/resources/${this.state.resource_id}/favorites/${this.state.currentUsersFavoriteId}/destroy`
    );
    this.setState({ currentUsersFavoriteId: "" });
  };

  render() {
    const { resource, favorited } = this.state;

    return (
      <Container>
        <Button.Group vertical size="small" floated="right">
          <Button onClick={(e) => this.onUpvote(e)}>&#9650;</Button>
          <Button basic>{this.state.voteTotal}</Button>
          <Button onClick={(e) => this.onDownvote(e)}>&#9660;</Button>
        </Button.Group>
        <h2>"{this.state.resource_name}"</h2>
        <p
          onClick={
            this.state.currentUsersFavoriteId
              ? this.onRemoveFromFavorites
              : this.onAddToFavorites
          }
        >
          {this.state.currentUsersFavoriteId ? "Remove from" : "Add to"}{" "}
          favorites
        </p>

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
            <b>Download: </b> {this.downloadLink()}
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
