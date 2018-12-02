import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Button, Icon, Responsive } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Nav extends Component {
  state = {
    activeItem: '',
    visible: false
  };

  renderContent() {
    const linkStyle = {
      color: 'white'
    };
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <Menu.Item>
            <Responsive {...Responsive.onlyMobile} as={Button} primary>
              <a style={linkStyle} href="/auth/google">
                Login
              </a>
            </Responsive>
            <Responsive
              as={Button}
              primary
              minWidth={Responsive.onlyTablet.minWidth}
            >
              <a style={linkStyle} href="/auth/google">
                Login with <Icon name="google" />
              </a>
            </Responsive>
          </Menu.Item>
        );
      default:
        return (
          <Menu.Item>
            <Responsive {...Responsive.onlyMobile} as={Button} secondary>
              <a href="/api/logout" style={linkStyle}>
                <Icon name="sign-out" />
              </a>
            </Responsive>
            <Responsive
              as={Button}
              secondary
              minWidth={Responsive.onlyTablet.minWidth}
            >
              <a href="/api/logout" style={linkStyle}>
                Logout <Icon name="sign-out" />
              </a>
            </Responsive>
          </Menu.Item>
        );
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <Menu size="large">
        <Menu.Item as={Link} to="/">
          <Icon name="home" />
        </Menu.Item>

        <Menu.Item
          as={Link}
          to="/about"
          icon="question"
          active={activeItem === 'about'}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          as={Link}
          to="/units"
          icon="folder open"
          active={activeItem === 'resources'}
          onClick={this.handleItemClick}
        />
        {this.props.auth ? (
          <Menu.Item
            as={Link}
            to="/profile"
            icon="id card"
            active={activeItem === 'profile'}
            onClick={this.handleItemClick}
          />
        ) : (
          <p />
        )}
        <Menu.Menu position="right">
          {/* <Menu.Item>
            <Input icon="search" placeholder="Search..." />
          </Menu.Item> */}
          <Menu.Item as={Link} to="/resources/new" icon="add" />

          {this.renderContent()}
        </Menu.Menu>
      </Menu>
    );
  }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps)(Nav);
