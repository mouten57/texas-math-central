import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu, Button, Icon } from 'semantic-ui-react';
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
            <Button primary>
              <a style={linkStyle} href="/auth/google">
                Login with Google
              </a>
            </Button>
          </Menu.Item>
        );
      default:
        return (
          <Button>
            <a href="/api/logout">Logout</a>
          </Button>
        );
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <Menu size="small">
        <Link to="/">
          <Menu.Item>
            <i className="fas fa-calculator" style={{ marginTop: '4px' }}>
              {' '}
              TMC
            </i>
          </Menu.Item>
        </Link>

        <Menu.Item
          as={Link}
          to="/about"
          name="about"
          active={activeItem === 'about'}
          onClick={this.handleItemClick}
        />

        <Menu.Item
          as={Link}
          to="/units"
          name="resources"
          active={activeItem === 'resources'}
          onClick={this.handleItemClick}
        />

        <Menu.Menu position="right">
          {/* <Menu.Item>
            <Input icon="search" placeholder="Search..." />
          </Menu.Item> */}
          <Menu.Item>
            <Link to="/resources/new">
              <Icon name="add" />
            </Link>
          </Menu.Item>

          <Menu.Item>{this.renderContent()}</Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps)(Nav);
