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

  renderMyResources() {
    //resource _user must match this.props.auth._id
    let myResources = this.props.resources.filter(
      resource => resource._user === this.props.auth._id
    );
    console.log(myResources);
  }

  render() {
    let myResources = this.props.resources.filter(
      resource => resource._user === this.props.auth._id
    );

    return (
      <Container>
        {this.renderHeading()}
        <Header as="h2" dividing>
          Latest Resources
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
          Latest Comments
        </Header>
        <Header as="h2" dividing>
          Favorites
        </Header>
      </Container>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(UserProfile);
