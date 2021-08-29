import React from "react";

import { Message, Container, Button, Icon } from "semantic-ui-react";
import { Link } from "react-router-dom";

const NotAuthorized = (props) => {
  //console.log(props);
  return (
    <Container>
      <Message
        icon="thumbs down"
        header="Error: You are not authorized!"
        content=""
      />

      <Button.Group fluid>
        <Link to="/" style={{ color: "white" }}>
          <Button color="red">
            <Icon name="arrow alternate circle left outline" />
            Go Back
          </Button>
        </Link>
      </Button.Group>
    </Container>
  );
};

export default NotAuthorized;
