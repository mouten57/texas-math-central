import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Icon, List } from 'semantic-ui-react';

const description = [
  <List>
    <List.Item>Item 1</List.Item>
    <List.Item>Item 2</List.Item>
    <List.Item>Item 3</List.Item>
  </List>
];

const ResourceCard = props => (
  <Card>
    <Card.Content header={props.name} />
    <Card.Content description={description} />
    <Card.Content extra>
      <Icon name="eye" />
      <Link to={props.moreLink}>..more</Link>
    </Card.Content>
  </Card>
);

export default ResourceCard;
