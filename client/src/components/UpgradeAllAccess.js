import React, { Component } from "react";
import {
  Container,
  Segment,
  Header,
  List,
  Image,
  Button,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../actions";
import a from "../";
import just_do_it from "../images/just-do-it.gif";

class Upgrade extends Component {
  render() {
    return (
      <Container>
        <Segment color="blue">
          <Header as="h1">Upgrade Today!</Header>
          <Header as="h2">What you'll get:</Header>
          <List size="big">
            <List.Item>
              Every resource we have, now and in the future...for life!
            </List.Item>
            <List.Item>Premium support</List.Item>
            <List.Item>
              Instant access to a veteran teacher's file cabinet!
            </List.Item>
          </List>

          <Image
            src={just_do_it}
            centered
            rounded
            size="big"
            style={{ marginBottom: "25px" }}
          />
          <Button
            style={{ width: "80%", margin: "0 auto" }}
            color="blue"
            fluid
            as={Link}
            to={{ pathname: "/checkout", state: { fromAllAccess: true } }}
          >
            Upgrade now
          </Button>
        </Segment>
      </Container>
    );
  }
}

export default connect(null, actions)(Upgrade);
