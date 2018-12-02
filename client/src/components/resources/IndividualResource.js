import React, { Component } from 'react';
import { Container, Loader, Form, Button } from 'semantic-ui-react';
import _ from 'lodash';
import axios from 'axios';

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
      currentComment: null,
      isLoading: true,
      commentValue: ''
    };
  }

  componentDidMount() {
    //need to keep this axios call in order to get file data
    //in my props resources, I didn't load the binary data on initial call because it was really slow.

    axios.get(`/api/resources/${this.props.match.params.id}`).then(res => {
      const resource = res.data;
      this.setState({
        resource,
        resource_data: resource[0].file_data,
        resource_name: resource[0].name,
        resource_id: resource[0]._id,
        resourceComments: resource[0].comments,
        isLoading: false
      });
    });
  }

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

  onChangeValue(e) {
    this.setState({ commentValue: e.target.value });
  }

  render() {
    return (
      <Container>
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
