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
      <Responsive {...Responsive.onlyMobile}>
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
      </Responsive>

      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <Button.Group fluid style={{ marginTop: '35px' }}>
          <Button size="large" color="google plus">
            <a href="/auth/google" style={{ color: 'white' }}>
              Login with Google
            </a>
          </Button>
          <Button.Or />
          <Button positive size="large">
            <Link to="/units" style={{ color: 'white' }}>
              View Resources
            </Link>
          </Button>
        </Button.Group>
      </Responsive>
    </Container>
  );
};

export default Landing;
