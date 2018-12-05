import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Header, Container, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import NotLoggedIn from './NotLoggedIn';
import axios from 'axios';

class UserProfile extends Component {
  state = {
    activeItem: '',
    visible: false,
    comments: [],
    resources: []
  };
  componentWillMount() {
    console.log('profile update');
    axios.get('/api/comments').then(res => {
      const comments = res.data;

      this.setState({ comments });
    });
  }
  componentDidMount() {
    this.setState({ resources: this.props.resources });
  }

  renderHeading() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return <NotLoggedIn />;
      default:
        return (
          <Header as="h1" textAlign="center">
            <Image size="massive" circular src={this.props.auth.image} />
            <p>{this.props.auth.nickname}'s Profile</p>
          </Header>
        );
    }
  }

  renderComments() {
    switch (this.state.comments) {
      case null:
        return;
      case false:
        return <p />;
      default:
        let myComments = this.state.comments.filter(
          comment => comment._user[0]._id === this.props.auth._id
        );

        myComments.map(comment => {
          return <p>{comment.body}</p>;
        });
    }
  }

  render() {
    let myResources = this.state.resources.filter(
      resource => resource._user[0]._id === this.props.auth._id
    );

    return (
      <Container>
        {this.renderHeading()}
        <Header as="h2" dividing>
          My Resources
        </Header>
        <div>
          {myResources.map(resource => {
            return (
              <div key={resource._id}>
                <List.Icon name="file" />
                <Link
                  style={{ color: '#858DAA' }}
                  to={`/units/${resource.unit}/${resource._id}`}
                >
                  <h3 style={{ display: 'inline-block', marginTop: '5px' }}>
                    "{resource.name}"
                  </h3>
                </Link>
              </div>
            );
          })}
        </div>

        <Header as="h2" dividing>
          My Comments
        </Header>
        <div>
          {this.state.comments.map(comment => {
            return (
              <p key={comment._id}>
                {comment.body} on {comment.posted}
              </p>
            );
          })}
        </div>
        <Header as="h2" dividing>
          My Favorites
        </Header>
      </Container>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(UserProfile);
