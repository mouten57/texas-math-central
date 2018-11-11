import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <li>
            <a href="/auth/google">Login With Google</a>
          </li>
        );
      default:
        return [
          <li key="1" style={{ margin: '0 10px' }}>
            Credits: {this.props.auth.credits}
          </li>,
          <li key="2">
            <a href="/api/logout">Logout</a>
          </li>
        ];
    }
  }
  render() {
    return (
      <nav>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="title" color="inherit">
              Texas Math Central
            </Typography>
          </Toolbar>
        </AppBar>
      </nav>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
