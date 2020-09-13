import React from "react";
import { Form, Segment, Button, Header } from "semantic-ui-react";

const onSubmit = () => {
  console.log("test");
};
const SignUpForm = (props) => {
  return (
    <Segment raised style={{ maxWidth: "650px", margin: "0 auto" }}>
      <Header>Sign Up Today!</Header>
      <Form onSubmit={onSubmit}>
        <Form.Group widths="equal">
          <Form.Input fluid label="First" placeholder="Bob" required />
          <Form.Input fluid label="Last" placeholder="Ross" required />
        </Form.Group>
        <Form.Input
          fluid
          label="Email"
          placeholder="paintin_for_smilez@gmail.com"
          required
        />
        <Button color="instagram" type="submit" style={{ margin: "0 auto" }}>
          Sign Up
        </Button>
      </Form>
    </Segment>
  );
};

export default SignUpForm;
