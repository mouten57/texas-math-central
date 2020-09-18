import React, { Component } from "react";
import { Grid, Modal, Image, Header, Button } from "semantic-ui-react";
import axios from "axios";
import AdminModal from "./Modal";
import "./Admin.css";

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: this.props.resources || [],
      users: [],
      modalOpen: false,
    };
  }
  setOpen = (bool) => {
    this.setState({ modalOpen: bool });
  };
  componentDidMount() {
    axios
      .get("/api/admin")
      .then((res) => {
        let { users } = res.data;
        this.setState({ users });
      })
      .catch((err) => console.log(err));
  }
  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const bandA = a.name.toUpperCase();
    const bandB = b.name.toUpperCase();

    let comparison = 0;
    if (bandA > bandB) {
      comparison = 1;
    } else if (bandA < bandB) {
      comparison = -1;
    }
    return comparison;
  }

  renderModal = (data, user_or_resource) => {
    this.setState({
      modalOpen: true,
      user_or_resource,
      data,
    });
  };
  render() {
    //console.log(this.state);
    const { users, data, user_or_resource } = this.state;
    const { resources } = this.props;

    return (
      <div>
        <h1>Welcome to the admin page.</h1>
        <Grid>
          <Grid.Column width={8}>
            <h3>Resources</h3>
            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              {resources?.sort(this.compare).map((resource) => {
                return (
                  <li onClick={() => this.renderModal(resource, "resource")}>
                    {resource.name}
                  </li>
                );
              })}
            </ul>
          </Grid.Column>
          <Grid.Column width={8}>
            <h3>Users</h3>

            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              {users?.sort(this.compare).map((user) => {
                return (
                  <li onClick={() => this.renderModal(user, "user")}>
                    {user.name}
                  </li>
                );
              })}
            </ul>
            <AdminModal
              setOpen={this.setOpen}
              user_or_resource={user_or_resource}
              open={this.state.modalOpen}
              data={data}
            />
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default AdminPage;
