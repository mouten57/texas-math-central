import React from 'react';
import {
  Container,
  Divider,
  List,
  Placeholder,
  Breadcrumb
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Section link>
          <Link to="/">Home</Link>
        </Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section active>About</Breadcrumb.Section>
      </Breadcrumb>
      <Container text textAlign="justified" style={{ marginTop: '40px' }}>
        <h2>About</h2>
        <Divider />
        <p>
          This website is all about teachers. It was designed and created with
          one goal in mind: to get all the best math resources in one location.
          No more aimless searching.
        </p>
        <p>Find the most popular (free) resources today.</p>

        <h3 style={{ marginTop: '50px' }}>Why Texas Math Central?</h3>
        <Divider />
        <List
          items={[
            'Resources voted on by Texas Math Teachers',
            'Everything is FREE!',
            '...fill this in later...'
          ]}
        />

        <h4 style={{ marginTop: '50px' }}>Other Info:</h4>
        <Divider />
        <Placeholder fluid>
          <Placeholder.Header image>
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Header>
          <Placeholder.Paragraph>
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder.Paragraph>
        </Placeholder>
      </Container>
    </div>
  );
};

export default About;
