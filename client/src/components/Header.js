import React, { Component } from "react";
import { connect } from "react-redux";
import { Menu, Icon, Dropdown, Popup } from "semantic-ui-react";
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
          <Menu.Item as={Link} icon="google" to="/login">
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
        <Popup
          basic
          position="bottom right"
          content="Learn more about TMC"
          trigger={
            <Menu.Item
              as={Link}
              to="/about"
              icon="question"
              active={activeItem === "about"}
              onClick={this.handleItemClick}
            />
          }
        />

        <Dropdown item icon="folder open" simple>
          <Dropdown.Menu>
            <Dropdown.Item as={Link} to="/units?subject=math">
              Math
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/units?subject=science">
              Science
            </Dropdown.Item>
            <Dropdown.Item as={Link} to="/units?subject=other">
              Other
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        {/* <Menu.Item
          as={Link}
          to="/units"
          
          active={activeItem === "resources"}
          onClick={this.handleItemClick}
        /> */}
        {this.props.auth ? (
          <Popup
            basic
            position="bottom left"
            content="View your profile"
            trigger={
              <Menu.Item
                as={Link}
                to="/profile"
                icon="id card"
                active={activeItem === "profile"}
                onClick={this.handleItemClick}
              />
            }
          />
        ) : (
          <p />
        )}
        <Menu.Menu position="right">
          <Popup
            basic
            position="bottom left"
            content="Add a new resource"
            trigger={<Menu.Item as={Link} to="/resources/new" icon="add" />}
          />
          <Popup
            basic
            position="bottom left"
            content="View your cart"
            trigger={<Menu.Item as={Link} to="/cart" icon="cart" />}
          />
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
