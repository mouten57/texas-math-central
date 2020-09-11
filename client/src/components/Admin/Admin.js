import React, { Component } from "react";
import { Grid, Modal, Image, Header, Button } from "semantic-ui-react";
import axios from "axios";

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resources: this.props.resources || [],
      users: [],
      userModalOpen: false,
    };
  }
  setOpen = (bool) => {
    this.setState({ userModalOpen: bool });
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

  renderModal = (user) => {
    this.setState({
      userModalOpen: true,
      modal: user,
    });
  };
  render() {
    const { users, modal } = this.state;
    const { resources } = this.props;

    console.log(users, resources);

    return (
      <div>
        <h1>Welcome to the admin page.</h1>
        <Grid>
          <Grid.Column width={4}>
            <h3>Resources</h3>
            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              {resources?.sort(this.compare).map((resource) => {
                return (
                  <li key={resource._id}>
                    <a href={`/units/${resource.unit}/${resource._id}`}>
                      {resource.name}
                    </a>
                  </li>
                );
              })}
            </ul>
          </Grid.Column>
          <Grid.Column width={4}>
            <h3>Users</h3>

            <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
              {users?.sort(this.compare).map((user) => {
                console.log(user);
                return (
                  <>
                    <li onClick={() => this.renderModal(user)}>{user.name}</li>
                  </>
                );
              })}
            </ul>
            <Modal
              onClose={() => this.setOpen(false)}
              onOpen={() => this.setOpen(true)}
              open={this.state.userModalOpen}
            >
              <Modal.Header>{modal?.name}</Modal.Header>
              <Modal.Content image>
                <Image size="medium" src={modal?.image} wrapped />
                <Modal.Description>
                  <Header>Role: {modal?.role}</Header>
                  <p>User Token: {modal?.token}</p>
                  <div>
                    <h5>Resources:</h5>
                    <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                      {modal?.resources.length > 0
                        ? modal.resources.map((resource) => {
                            return (
                              <li key={resource._id}>
                                <a
                                  href={`/units/${resource.unit}/${resource._id}`}
                                >
                                  {resource.name}
                                </a>
                              </li>
                            );
                          })
                        : "None"}
                    </ul>

                    <h5>Comments:</h5>
                    <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                      {modal?.comments.length > 0
                        ? modal.comments.map((comment) => {
                            return (
                              <li key={comment._id}>
                                "{comment.body}" on{" "}
                                <a
                                  href={`/units/${comment.resource_id.unit}/${comment.resource_id._id}`}
                                >
                                  {comment.resource_id.name}
                                </a>
                              </li>
                            );
                          })
                        : "None"}
                    </ul>
                    <h5>Purchased Resources:</h5>
                    <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                      {modal?.purchasedResources.length > 0
                        ? modal.purchasedResources.map((resource) => {
                            return (
                              <li key={resource._id}>
                                <a
                                  href={`/units/${resource.unit}/${resource._id}`}
                                >
                                  {resource.name}
                                </a>
                              </li>
                            );
                          })
                        : "None"}
                    </ul>
                  </div>
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
                <Button color="black" onClick={() => this.setOpen(false)}>
                  Nope
                </Button>
                <Button
                  content="Yep, that's me"
                  labelPosition="right"
                  icon="checkmark"
                  onClick={() => this.setOpen(false)}
                  positive
                />
              </Modal.Actions>
            </Modal>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default AdminPage;
