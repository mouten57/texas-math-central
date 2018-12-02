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
  convertTimestamp = timestamp => {
    var d = new Date(timestamp), // Convert the passed timestamp to milliseconds
      yyyy = d.getFullYear(),
      mm = ('0' + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
      dd = ('0' + d.getDate()).slice(-2), // Add leading 0.
      hh = d.getHours(),
      h = hh,
      min = ('0' + d.getMinutes()).slice(-2), // Add leading 0.
      ampm = 'AM',
      time;

    if (hh > 12) {
      h = hh - 12;
      ampm = 'PM';
    } else if (hh === 12) {
      h = 12;
      ampm = 'PM';
    } else if (hh === 0) {
      h = 12;
    }

    // ie: 2013-02-18, 8:35 AM
    time = mm + '/' + dd + '/' + yyyy + ', ' + h + ':' + min + ' ' + ampm;
    return time;
  };

  render() {
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
                    <span>
                      Posted at {this.convertTimestamp(comment.posted)}
                    </span>
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

/* <Comment.Group size="small">
    <Header as="h3" dividing>
        Small Comments
            </Header>

    <Comment>
        <Comment.Avatar as="a" src="/images/avatar/small/matt.jpg" />
        <Comment.Content>
            <Comment.Author as="a">Matt</Comment.Author>
            <Comment.Metadata>
                <span>Today at 5:42PM</span>
            </Comment.Metadata>
            <Comment.Text>How artistic!</Comment.Text>
            <Comment.Actions>
                <a>Reply</a>
            </Comment.Actions>
        </Comment.Content>
    </Comment>
    <Comment>
        <Comment.Avatar as="a" src="/images/avatar/small/joe.jpg" />
        <Comment.Content>
            <Comment.Author as="a">Joe Henderson</Comment.Author>
            <Comment.Metadata>
                <span>5 days ago</span>
            </Comment.Metadata>
            <Comment.Text>
                Dude, this is awesome. Thanks so much
                </Comment.Text>
            <Comment.Actions>
                <a>Reply</a>
            </Comment.Actions>
        </Comment.Content>
    </Comment>
</Comment.Group> */
