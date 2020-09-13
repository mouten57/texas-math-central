import React from "react";
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

const renderContent = () => {
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
};
const onSubmit = () => {
  console.log("test");
};

const Login = (props) => {
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
            <Form.Input placeholder="Email address" fluid required></Form.Input>

            <Form.Input placeholder="Password" fluid required></Form.Input>

            <Button.Group fluid>
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
