import { Header, Comment } from "semantic-ui-react";
import React, { Component } from "react";
import { connect } from "react-redux";
import convertTimestamp from "../../helpers/convertTimestamp";
import axios from "axios";

class ShowComment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
    };
  }

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
                    {comment._user[0].nickname}
                  </Comment.Author>
                  <Comment.Metadata>
                    <span>Posted at {convertTimestamp(comment.posted)}</span>
                  </Comment.Metadata>
                  <Comment.Text>{comment.body}</Comment.Text>
                  {comment._user[0]?._id === this.props.auth._id ||
                  this.props.auth?.role === "admin" ? (
                    <form onSubmit={(e) => this.onDelete(e, comment)}>
                      <button
                        className="btn btn btn-sm btn-outline-danger"
                        type="submit"
                      >
                        Delete
                      </button>
                    </form>
                  ) : null}
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
