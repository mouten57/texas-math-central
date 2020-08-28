import React from "react";
import {
  Container,
  Divider,
  Segment,
  Placeholder,
  Breadcrumb,
} from "semantic-ui-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Section>
          <Link to="/">Home</Link>
        </Breadcrumb.Section>
        <Breadcrumb.Divider />
        <Breadcrumb.Section active>About</Breadcrumb.Section>
      </Breadcrumb>
      <Container text textAlign="justified" style={{ marginTop: "40px" }}>
        <h2>About</h2>
        <Divider />
        <p>
          TMC was created with one goal in mind: to get all the best math
          resources in one location. This site is specific to Texas 5th Grade
          math teachers, with plans to expand in the near future. If you are a
          5th grade math teacher, you're in the right place.
        </p>
        <p>
          My name is Matt Outen and I have taught 5th grade for the last 6
          years. If you need help with anything on the site, or have
          suggestions, please feel free to{" "}
          <a href="mailto:texasmathcentral@gmail.com" target="blank">
            contact me
          </a>
          .
        </p>

        <h3 style={{ marginTop: "50px" }}>Find Resources</h3>
        <Divider />
        <Segment raised size="large" padded="very">
          <h2 style={{ textAlign: "center" }}>Find Resources</h2>
          Finding resources is as easy as heading over to our{" "}
          <a href="/units">Units</a> page and finding whatever unit you are
          currently in. This covers most of the 5th grade math resources. They
          aren't listed by TEKS; they are organized into broader categories that
          made more sense to me as a teacher.
        </Segment>
        <Segment raised size="large" padded="very">
          <h2 style={{ textAlign: "center" }}>Add Your Own Resources</h2>
          Have something awesome that you want to share? Go to our{" "}
          <a href="resources/new">add resource form</a> and share away! We have
          the capabilities of adding pictures, docs, pdfs, or just plain old
          links!
        </Segment>
        <Segment raised size="large" padded="very">
          <h2 style={{ textAlign: "center" }}>
            Collaborate With Other Teachers
          </h2>
          What's better than knowing the best way to use a resource? Add
          comments, reply to others, or leave suggestions using our comment
          form! Here's an example:{" "}
          <a href="units/boy/5c11b93b63265f23141bbabf">Sample Resource</a>
        </Segment>
      </Container>
    </div>
  );
};

export default About;
