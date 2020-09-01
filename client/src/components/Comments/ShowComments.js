import { Header, Comment, Confirm } from "semantic-ui-react";
import React, { Component } from "react";
import { connect } from "react-redux";
import convertTimestamp from "../../helpers/convertTimestamp";
import { NotificationManager } from "react-notifications";
import "./style/ShowComments.css";

class ShowComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      commentToDelete: null,
      open: false,
    };
  }
  createNotification = (type) => {
    switch (type) {
      case "success":
        NotificationManager.success("Comment successfully removed!", "", 1500);
        break;
      case "warning":
        NotificationManager.warning(
          "Warning message",
          "Close after 3000ms",
          3000
        );
        break;

      default:
        break;
    }
  };

  show = (comment) => this.setState({ open: true, commentToDelete: comment });
  handleConfirm = (e, comment) => {
    this.props.onDeleteComment(this.state.commentToDelete, (err, result) => {
      if (err) throw err;
      this.setState({ result: "confirmed", open: false });
      setTimeout(() => this.createNotification("success"), 300);
    });
  };
  handleCancel = () => this.setState({ result: "cancelled", open: false });
  renderContent = () => {
    if (this.props.comments) {
      return this.props.comments.map((comment) => {
        console.log(comment);
        return (
          <Comment key={comment._id}>
            <Comment.Avatar as="a" src={comment._user.image} />
            <Comment.Content>
              <Comment.Author as="a">{comment._user.nickname}</Comment.Author>
              <Comment.Metadata>
                <span>Posted at {convertTimestamp(comment.created_at)}</span>
              </Comment.Metadata>
              <Comment.Text>{comment.body}</Comment.Text>
              {comment._user._id == this.props.auth._id ||
              this.props.auth?.role == "admin" ? (
                <Comment.Action
                  className="custom_delete_action"
                  onClick={() => this.show(comment)}
                >
                  Delete
                </Comment.Action>
              ) : null}
            </Comment.Content>
          </Comment>
        );
      });
    }
  };

  render() {
    const { open } = this.state;
    return (
      <Comment.Group size="small" style={{ marginTop: "15px" }}>
        <Header as="h3" dividing>
          Comments
        </Header>

        {this.renderContent()}
        <Confirm
          open={open}
          size="tiny"
          cancelButton="Cancel"
          confirmButton="Delete Comment"
          onCancel={this.handleCancel}
          onConfirm={this.handleConfirm}
        />
      </Comment.Group>
    );
  }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(mapStateToProps)(ShowComment);
