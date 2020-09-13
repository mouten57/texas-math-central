import React from "react";

import { Message, Container, Button, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <Container>
      <Message
        icon="thumbs down"
        header="Error: You need to login!"
        content="Upload your own resources, comment, and vote."
      />

      <Button as={Link} to="/login" color="instagram" fluid>
        Login Now
        <Icon name="sign-in" style={{ marginLeft: "5px" }} />
      </Button>

      <Link to="/units" style={{ color: "white" }}>
        <Button positive fluid>
          View Resources
          <Icon name="file" style={{ marginLeft: "5px" }} />
        </Button>
      </Link>
    </Container>
  );
};

export default Landing;
