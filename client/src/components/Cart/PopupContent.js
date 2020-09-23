import React from "react";
import { Grid, Header, Button } from "semantic-ui-react";

const PopupContent = (props) => {
  const { product } = props;
  const { _id, unit } = product.resource_id || false;
  return (
    <Grid centered>
      <Grid.Column textAlign="center">
        <Button color="green" as="a" href={`/units/${unit}/${_id}`}>
          View Resource
        </Button>

        <Button color="red" onClick={() => props.onRemoveItem(_id)}>
          Remove
        </Button>
      </Grid.Column>
    </Grid>
  );
};

export default PopupContent;
