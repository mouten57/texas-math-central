import React, { useState } from "react";
import axios from "axios";
import { Form, Segment, Button, Header } from "semantic-ui-react";
import param_map from "./param_to_full";
import createNotification from "../Resources/Notification";

const initialState = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  password_confirm: "",
};

const SignUpForm = (props) => {
  const [user, updateUser] = useState(initialState);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    updateUser({ ...user, [name]: value });
  };
  const onSubmit = (e) => {
    axios
      .post("/api/sign_up", user)
      .then((res) => {
        updateUser(initialState);
        createNotification("success");
        setTimeout(() => {
          props.fetchUser();
          props.history.push({
            pathname: `/profile`,
          });
        }, 1000);
      })
      .catch((err) => {
        console.log(err.response);
        let arr = err.response.data.errors;
        if (arr) {
          let error_string = "";
          for (let i in arr) {
            error_string +=
              param_map[arr[i].param] +
              " " +
              arr[i].msg +
              (i == arr.length - 1 ? "" : ", ");
          }
          alert(error_string);
        } else {
          alert(err.response.data.msg);
        }
      });
  };

  const { firstname, lastname, email, password, password_confirm } = user;
  return (
    <Segment raised style={{ maxWidth: "650px", margin: "0 auto" }}>
      <Header>Sign Up Today!</Header>
      <Form onSubmit={onSubmit}>
        <Form.Group widths="equal">
          <Form.Input
            fluid
            onChange={handleInputChange}
            label="First"
            name="firstname"
            value={firstname}
            type="text"
            placeholder="Bob"
            required
          />
          <Form.Input
            fluid
            onChange={handleInputChange}
            label="Last"
            name="lastname"
            value={lastname}
            type="text"
            placeholder="Ross"
            required
          />
        </Form.Group>
        <Form.Input
          fluid
          onChange={handleInputChange}
          value={email}
          name="email"
          type="email"
          label="Email"
          placeholder="paintin_for_smilez@gmail.com"
          required
        />
        <Form.Group widths="equal">
          <Form.Input
            fluid
            value={password}
            onChange={handleInputChange}
            name="password"
            type="password"
            label="Password"
            placeholder="************"
            required
          />
          <Form.Input
            fluid
            value={password_confirm}
            onChange={handleInputChange}
            name="password_confirm"
            type="password"
            label="Confirm Password"
            placeholder="************"
            required
          />
        </Form.Group>
        <Form.Field>Password must be at least 5 characters long</Form.Field>
        <Button color="instagram" type="submit" style={{ margin: "0 auto" }}>
          Sign Up
        </Button>
      </Form>
    </Segment>
  );
};

export default SignUpForm;
