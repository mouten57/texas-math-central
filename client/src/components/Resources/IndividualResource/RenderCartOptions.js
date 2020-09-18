import React from "react";
import { Button } from "semantic-ui-react";

const RenderCartOptions = (props) => {
  const { resource, auth, state } = props;
  if (resource && auth && resource._user) {
    if (resource._user?._id == auth?._id) {
      return <p>My resource</p>;
    } else if (auth.role == "admin") {
      return <p>Admin Access!</p>;
    } else if (auth.role == "all_access") {
      return <p>Premium User Access!</p>;
    } else if (auth?.purchasedResources.includes(resource._id)) {
      return <p>Purchased Item</p>;
    } else {
      return (
        <p
          onClick={() =>
            props.onAddRemoveCart(
              resource._id,
              state.item_in_cart ? "remove" : "add"
            )
          }
        >
          <Button color={state.item_in_cart ? "teal" : "blue"} size="tiny">
            {state.item_in_cart ? "Remove from" : "Add to"} Cart
          </Button>
        </p>
      );
    }
  } else {
    return null;
  }
};

export default RenderCartOptions;
