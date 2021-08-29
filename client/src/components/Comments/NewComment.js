import React, { Component } from "react";
import { Form, Button } from "semantic-ui-react";
import axios from "axios";

class NewComment extends Component {
  onSubmitComment = () => {
    this.props.clearComment();
    let comment = {};
    comment.body = this.props.commentValue;
    let allComments = [...this.props.comments];
    axios
      .post(`/api/resources/${this.props.resourceId}/comments/create`, comment)
      .then((comment) => allComments.push(comment.data))
      .then(() => {
        this.props.onSubmitNewComment(allComments);
      });
  };
  render() {
    return (
      <Form style={{ marginTop: "20px" }} onSubmit={this.onSubmitComment}>
        <div>
          <label htmlFor="body">New Comment</label>
          <Form.Input
            name="body"
            aria-describedby="bodyHelp"
            placeholder="Enter comment"
            onChange={(e) => {
              this.props.onChangeValue(e);
            }}
            value={this.props.commentValue}
          />

          <small id="bodyHelp">
            Comment must be 3 or more characters in length.
          </small>
        </div>
        <Button
          type="submit"
          disabled={this.props.commentValue.length > 2 ? false : true}
        >
          Submit
        </Button>
      </Form>
    );
  }
}

export default NewComment;
