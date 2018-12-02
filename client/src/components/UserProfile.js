import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Image, Header, Container, List } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import NotLoggedIn from './NotLoggedIn';

class UserProfile extends Component {
  state = {
    activeItem: '',
    visible: false
  };

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

  renderComments() {
    switch (this.props.comments) {
      case null:
        return;
      case false:
        return <p />;
      default:
        let myComments = this.props.comments.filter(
          comment => comment._user[0]._id === this.props.auth._id
        );
        console.log(myComments);
        myComments.map(comment => {
          return <p>{comment.body}</p>;
        });
    }
  }

  render() {
    let myResources = this.props.resources.filter(
      resource => resource._user[0]._id === this.props.auth._id
    );
    let myComments = this.props.comments.filter(
      comment => comment._user[0]._id === this.props.auth._id
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
          {myComments.map(comment => {
            return (
              <p key={comment._id}>
                {comment.body} on {this.convertTimestamp(comment.posted)}
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
