import { Header, Comment } from 'semantic-ui-react';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class ShowComment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ comments: nextProps.comments });
  }

  render() {
    console.log(this.state);
    return (
      <Comment.Group size="small" style={{ marginTop: '15px' }}>
        <Header as="h3" dividing>
          Comments
        </Header>

        {this.props.comments ? (
          this.props.comments.map(comment => {
            return (
              <Comment key={comment._id}>
                <Comment.Avatar as="a" src={comment._user[0].image} />
                <Comment.Content>
                  <Comment.Author as="a">
                    {comment._user[0].nickname}
                  </Comment.Author>
                  <Comment.Metadata>
                    <span>Posted at {comment.posted}</span>
                  </Comment.Metadata>
                  <Comment.Text>{comment.body}</Comment.Text>
                  <Comment.Actions>
                    <p style={{ color: 'lightGrey' }}>Reply</p>
                  </Comment.Actions>
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
