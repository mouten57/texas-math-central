import { Container } from "semantic-ui-react";
import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import ShowComments from "./ShowComments";
import NewComment from "./NewComment";

class CommentsSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      commentValue: "",
    };
  }
  componentDidMount() {
    this.getResourceComments();
  }
  getResourceComments() {
    axios
      .get(`/api/resources/${this.props.resourceId}/comments`)
      .then((res) => {
        const comments = res.data;
        this.setState({
          comments,
        });
      });
  }
  onChangeValue = (e) => {
    this.setState({ commentValue: e.target.value });
  };
  onSubmitNewComment = (allComments) => {
    this.setState({ comments: allComments, commentValue: "" });
  };
  onDeleteComment = (comment, callback) => {
    var del_post_link = `/api/resources/${comment.resource_id}/comments/${comment._id}/destroy`;

    axios
      .post(del_post_link)
      .then((res) => {
        let updated_comments = this.state.comments.filter(function (el) {
          return el._id !== comment._id;
        });
        this.setState({ comments: updated_comments });
        callback(null, res.data);
      })
      .catch((err) => {
        callback(err);
      });
  };
  render() {
    return (
      <Container>
        <NewComment
          onChangeValue={this.onChangeValue}
          comments={this.state.comments}
          commentValue={this.state.commentValue}
          resourceId={this.props.resourceId}
          onSubmitNewComment={this.onSubmitNewComment}
        />
        {this.state.comments.length > 0 ? (
          <ShowComments
            onDeleteComment={this.onDeleteComment}
            resourceId={this.props.resourceId}
            comments={this.state.comments}
          />
        ) : null}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(mapStateToProps)(CommentsSection);