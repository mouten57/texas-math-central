import React, { Component } from "react";
import { Container, Loader, Button } from "semantic-ui-react";
import _ from "lodash";
import axios from "axios";
//import Voting from '../Voting';

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
      commentValue: "",
      voteTotal: 0,
      upvoted: false,
      downvoted: false,
    };
  }

  //is there a way to populate resource with one call rather than 3 separate calls?
  makeAxiosCalls = () => {
    //grab comments with call to api. searches for only comments matching resource_id
    //^moved this to comments area. segmented.

    //need to keep this axios call in order to get file data
    //in my props resources, I didn't load the binary data on initial call because it was really slow.
    axios
      .get(
        `/api/units/${this.props.match.params.unit}/${this.props.match.params.id}`
      )
      .then((res) => {
        const response = res.data;
        const resource = response.resource;
        this.setState({
          resource,
          resourceComments: response.comments,
          s3Link: resource.s3Link,
          resource_name: resource.name,
          resource_id: resource._id,
        });
      });

    //votes
    axios
      .get(`/api/resources/${this.props.match.params.id}/votes/total`)
      .then((res) => {
        const votes = res.data;
        if (votes.length > 0) {
          this.getVoteTotal(votes);
        }
      });
  };

  componentDidMount() {
    this.makeAxiosCalls();
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
  };

  downloadLink() {
    switch (this.state.resource.files?.length) {
      case null:
        return "";
      case 0:
        return "Download not available.";
      default:
        return this.state.resource.files?.map((file, i) => {
          let link = `/api/units/${this.props.match.params.unit}/${this.props.match.params.id}/download/${file.originalname}`;
          return (
            <span>
              <a
                href={link}
                download
                key={i}
                style={{ marginLeft: "5px" }}
                onClick={(e) => console.log(e.currentTarget.innerText)}
              >
                {file.filename}
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

  render() {
    console.log(this.state);
    const { resource } = this.state;

    return (
      <Container>
        <Button.Group vertical size="small" floated="right">
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
            <b>Uploader:</b> {resource._user ? resource._user[0].name : null}{" "}
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

export default IndividualResource;
