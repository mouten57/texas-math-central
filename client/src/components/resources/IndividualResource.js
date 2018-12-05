import React, { Component } from 'react';
import { Container, Loader, Form, Button } from 'semantic-ui-react';
import _ from 'lodash';
import axios from 'axios';
import Voting from '../Voting';

import ShowComments from '../Comments/Show';
class IndividualResource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: {},
      resource_data: null,
      resource_name: null,
      resource_id: null,
      resourceComments: [],
      commentValue: '',
      voteTotal: 0,
      upvoted: false,
      downvoted: false
    };
  }

  //is there a way to populate resource with one call rather than 3 separate calls?
  makeAxiosCalls() {
    //grab comments with call to api. searches for only comments matching resource_id
    axios
      .get(`/api/resources/${this.props.match.params.id}/comments`)
      .then(res => {
        const comments = res.data;
        this.setState({
          resourceComments: comments
        });
      });

    //need to keep this axios call in order to get file data
    //in my props resources, I didn't load the binary data on initial call because it was really slow.
    axios.get(`/api/resources/${this.props.match.params.id}`).then(res => {
      const resource = res.data;

      this.setState({
        resource,
        resource_data: resource[0].file_data,
        resource_name: resource[0].name,
        resource_id: resource[0]._id
      });
    });
    //votes
    axios
      .get(`/api/resources/${this.props.match.params.id}/votes/total`)
      .then(res => {
        const votes = res.data;
        if (votes.length > 0) {
          this.getVoteTotal(votes);
        }
      });
  }

  componentDidMount() {
    console.log('did mount-individ');
    this.makeAxiosCalls();
  }
  componentDidUpdate() {
    console.log('did update - individ');
  }
  getVoteTotal = votes => {
    let voteTotal = votes
      .map(v => {
        return v.value;
      })
      .reduce((prev, next) => {
        return prev + next;
      });
    //keeps state updated without calling to database

    this.setState({ voteTotal });
  };

  downloadLink() {
    switch (this.state.resource_data) {
      case null:
        return 'Error';
      case undefined:
        return 'Download not available.';
      default:
        let link = `/api/resources/${this.props.match.params.id}/download`;
        return (
          <a href={link} download>
            File
          </a>
        );
    }
  }

  onSubmitComment() {
    //error in here somewhere
    let comment = {};
    comment.body = this.state.commentValue;
    let allComments = [...this.state.resourceComments];
    axios
      .post(`/api/resources/${this.state.resource_id}/comments/create`, comment)
      .then(comment => allComments.push(comment.data))
      .then(() =>
        this.setState({ resourceComments: allComments, commentValue: '' })
      );
  }

  onChangeValue = e => {
    this.setState({ commentValue: e.target.value });
  };

  onUpvote = e => {
    axios
      .get(`/api/resources/${this.state.resource_id}/votes/upvote`)
      .then(res => {
        if (!this.state.upvoted) {
          this.setState({
            voteTotal: this.state.voteTotal + res.data.value,
            upvoted: true,
            downvoted: false
          });
        }
      });
  };
  onDownvote = e => {
    axios
      .get(`/api/resources/${this.state.resource_id}/votes/downvote`)
      .then(res => {
        if (!this.state.downvoted) {
          this.setState({
            voteTotal: this.state.voteTotal + res.data.value,
            downvoted: true,
            upvoted: false
          });
        }
      });
  };

  render() {
    return (
      <Container>
        <Button.Group vertical size="small" floated="right">
          <Button onClick={e => this.onUpvote(e)}>&#9650;</Button>
          <Button basic>{this.state.voteTotal}</Button>
          <Button onClick={e => this.onDownvote(e)}>&#9660;</Button>
        </Button.Group>
        <h2>"{this.state.resource_name}"</h2>

        {_.map(
          this.state.resource,
          ({ _id, name, unit, type, link, _user }) => (
            <div key={_id}>
              <p>
                <b>Name: </b>
                {name}
              </p>
              <p>
                <b>Unit:</b> {unit}
              </p>
              <p>
                <b>Type:</b> {type}
              </p>
              <p>
                <b>Link: </b>{' '}
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {link}
                </a>
              </p>
              <p>
                <b>Uploader:</b> {_user[0].name}
              </p>
              <p>
                <b>Download: </b> {this.downloadLink()}
              </p>
            </div>
          )
        )}

        <Form
          style={{ marginTop: '20px' }}
          onSubmit={comment => this.onSubmitComment(comment)}
        >
          <div>
            <label htmlFor="body">New Comment</label>
            <Form.TextArea
              name="body"
              aria-describedby="bodyHelp"
              placeholder="Enter comment"
              onChange={e => {
                this.onChangeValue(e);
              }}
              value={this.state.commentValue}
            />

            <small id="bodyHelp">
              comment must be 5 or more characters in length.
            </small>
          </div>
          <Button type="submit">Submit</Button>
        </Form>

        {this.state.isLoading ? (
          <Loader active inline="centered" />
        ) : (
          <ShowComments comments={this.state.resourceComments} />
        )}
      </Container>
    );
  }
}

export default IndividualResource;
