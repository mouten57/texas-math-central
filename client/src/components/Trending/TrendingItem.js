import React from "react";
import { Item } from "semantic-ui-react";
import { Link } from "react-router-dom";

const TrendingItem = (props) => {
  const { image, header, meta, description, unit, _id } = props;
  return (
    <Item>
      <Item.Image
        size="tiny"
        src={image}
        as={Link}
        to={`/units/${unit}/${_id}`}
      />
      <Item.Content>
        <Item.Header>{header}</Item.Header>
        <Item.Meta content={meta} />
        <Item.Description>{description}</Item.Description>
      </Item.Content>
    </Item>
  );
};

export default TrendingItem;
