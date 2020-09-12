import React from "react";
import { Icon, Button } from "semantic-ui-react";

const RightButtons = (props) => {
  return (
    <Button.Group
      vertical
      icon
      size="small"
      floated="right"
      style={{ marginTop: "15px" }}
    >
      {props.auth && !props.authorized_to_delete ? (
        <Button
          style={{ marginBottom: "10px" }}
          icon
          compact
          basic
          onClick={() =>
            props.currentUsersFavoriteId
              ? props.onAddRemoveFavorite("remove")
              : props.onAddRemoveFavorite("add")
          }
        >
          {" "}
          <Icon
            size="large"
            name={
              props.getFavoriteFor(props.auth?._id) ? "star" : "star outline"
            }
          />
        </Button>
      ) : null}
      <Button onClick={(e) => props.onUpvoteDownvote("upvote")}>&#9650;</Button>
      <Button basic>{props.voteTotal}</Button>
      <Button onClick={(e) => props.onUpvoteDownvote("downvote")}>
        &#9660;
      </Button>
    </Button.Group>
  );
};

export default RightButtons;
