import React from 'react';

import {
  Message,
  Container,
  Button,
  Icon,
  Responsive
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <Container>
      <Message
        icon="thumbs down"
        header="Error: You need to login!"
        content="Upload your own resources, comment, and vote."
      />

      <a href="/auth/google" style={{ color: 'white' }}>
        <Button color="google plus" fluid>
          Login with Google
          <Icon name="google plus" style={{ marginLeft: '5px' }} />
        </Button>
      </a>

      <Link to="/units" style={{ color: 'white' }}>
        <Button positive fluid>
          View Resources
          <Icon name="file" style={{ marginLeft: '5px' }} />
        </Button>
      </Link>
    </Container>
  );
};

export default Landing;
