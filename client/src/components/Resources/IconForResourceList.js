import React from "react";
import { Icon } from "semantic-ui-react";

const IconForResourceList = (props) => {
  const { direction, selected } = props;
  return selected ? (
    <Icon
      size="tiny"
      name={direction == "ascending" ? "arrow up" : "arrow down"}
      style={{ float: "right", marginTop: "8px" }}
    />
  ) : null;
};

export default IconForResourceList;
