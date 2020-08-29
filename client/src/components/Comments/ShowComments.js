import { Header, Comment, Confirm } from "semantic-ui-react";
import React, { Component } from "react";
import { connect } from "react-redux";
import convertTimestamp from "../../helpers/convertTimestamp";
import axios from "axios";

class ShowComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      open: false,
    };
  }
  show = () => this.setState({ open: true });
  handleConfirm = (e, comment) => {
    e.preventDefault();
    var del_post_link = `/api/resources/${comment.resource_id}/comments/${comment._id}/destroy`;

    axios
      .post(del_post_link, {
        _id: comment._id,
        resourceId: comment.resource_id,
      })
      .then((response) => {
        this.props.onCommentDelete(comment._id);
      });
    this.setState({ result: "confirmed", open: false });
  };
  handleCancel = () => this.setState({ result: "cancelled", open: false });

  onDelete = (e, comment) => {
    e.preventDefault();
    var del_post_link = `/api/resources/${comment.resource_id}/comments/${comment._id}/destroy`;

    axios
      .post(del_post_link, {
        _id: comment._id,
        resourceId: comment.resource_id,
      })
      .then((response) => {
        this.props.onCommentDelete(comment._id);
      });
  };
  render() {
    const { open } = this.state;
    return (
      <Comment.Group size="small" style={{ marginTop: "15px" }}>
        <Header as="h3" dividing>
          Comments
        </Header>

        {this.props.comments ? (
          this.props.comments.map((comment) => {
            return (
              <Comment key={comment._id}>
                <Comment.Avatar as="a" src={comment._user[0].image} />
                <Comment.Content>
                  <Comment.Author as="a">
                    {comment._user[0]?.nickname}
                  </Comment.Author>
                  <Comment.Metadata>
                    <span>Posted at {convertTimestamp(comment.posted)}</span>
                  </Comment.Metadata>
                  <Comment.Text>{comment.body}</Comment.Text>
                  {comment._user[0] === this.props.auth ||
                  this.props.auth?.role === "admin" ? (
                    <Comment.Action onClick={this.show}>Delete</Comment.Action>
                  ) : null}
                  <Confirm
                    open={open}
                    size="tiny"
                    cancelButton="Cancel"
                    confirmButton="Delete Comment"
                    onCancel={this.handleCancel}
                    onConfirm={(e) => this.handleConfirm(e, comment)}
                  />
                </Comment.Content>
              </Comment>
            );
          })
        ) : (
          <p />
        )}
      </Comment.Group>
    );
  }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(mapStateToProps)(ShowComment);
