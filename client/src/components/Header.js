import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

class Nav extends Component {
  state = {
    activeItem: "",
    visible: false,
  };

  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <Menu.Item as="a" icon="google" href="/auth/google">
            Login
          </Menu.Item>
        );
      default:
        return <Menu.Item as="a" icon="sign-out" href="/api/logout" />;
    }
  }

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const { activeItem } = this.state;

    return (
      <Menu>
        <Menu.Item as={Link} to="/">
          <Icon name="home" />
        </Menu.Item>

        <Menu.Item
          as={Link}
          to="/about"
          icon="question"
          active={activeItem === "about"}
          onClick={this.handleItemClick}
        />
        <Menu.Item
          as={Link}
          to="/units"
          icon="folder open"
          active={activeItem === "resources"}
          onClick={this.handleItemClick}
        />
        {this.props.auth ? (
          <Menu.Item
            as={Link}
            to="/profile"
            icon="id card"
            active={activeItem === "profile"}
            onClick={this.handleItemClick}
          />
        ) : (
          <p />
        )}
        <Menu.Menu position="right">
          <Menu.Item as={Link} to="/resources/new" icon="add" />
          <Menu.Item as={Link} to="/cart" icon="cart" />
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
