import React from "react";

const RenderCartOptions = (props) => {
  console.log(props);
  const { resource, auth, state } = props;
  if (resource && auth && resource._user) {
    if (resource._user?._id == auth?._id) {
      return <p>My resource</p>;
    } else if (auth.role == "admin" || auth.role == "all_access") {
      return <p>Premium User Access!</p>;
    } else if (auth?.purchasedResources.includes(resource._id)) {
      return <p>Purchased Item</p>;
    } else {
      return (
        <p
          className="add-to-cart"
          onClick={() =>
            props.onAddRemoveCart(
              resource._id,
              state.item_in_cart ? "remove" : "add"
            )
          }
        >
          <b style={{ backgroundColor: "yellow" }}>
            {state.item_in_cart ? "Remove from" : "Add to"} Cart
          </b>
        </p>
      );
    }
  } else {
    return null;
  }
};

export default RenderCartOptions;
