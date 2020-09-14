import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Form,
  Divider,
  Segment,
  Header,
  Menu,
  Button,
  Icon,
} from "semantic-ui-react";
import axios from "axios";
import createNotification from "../Resources/Notification";

const initialState = {
  email: "",
  password: "",
};

const Login = (props) => {
  const [user, updateUser] = useState(initialState);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateUser({ ...user, [name]: value });
  };
  const onSubmit = () => {
    axios
      .post("/api/sign_in", user)
      .then((res) => {
        props.fetchUser();
        props.history.push({ pathname: "/" });
      })
      .catch((err) => {
        createNotification("login_error");
        setTimeout(() => updateUser({ password: "" }), 1500);
        console.log(err);
      });
  };
  const { email, password } = user;
  return (
    <Grid>
      <Grid.Column>
        <Segment
          raised
          size="mini"
          style={{ maxWidth: "650px", margin: "0 auto" }}
        >
          <Header>Login</Header>
          <Form onSubmit={onSubmit}>
            <Form.Input
              placeholder="Email address"
              name="email"
              value={email}
              type="email"
              fluid
              required
              onChange={handleInputChange}
            ></Form.Input>

            <Form.Input
              placeholder="Password"
              name="password"
              value={password}
              type="password"
              fluid
              required
              onChange={handleInputChange}
            ></Form.Input>

            <Button.Group fluid widths={4}>
              <Button color="instagram" type="submit">
                Sign In
              </Button>
              <Button.Or></Button.Or>
              <Button as={Link} to="/signup">
                Sign Up Today!
              </Button>
            </Button.Group>
          </Form>
          <Divider />
          <Button as="a" href="/auth/google" color="google plus" fluid>
            Sign in with{" "}
            <Icon style={{ marginLeft: "0px" }} name="google"></Icon>
          </Button>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
