import React from "react";
import { Dimmer, Loader, Image, Segment } from "semantic-ui-react";

const LoaderExample = (props) => (
  <Dimmer active={props.active} inverted>
    <Loader size="massive">Working...</Loader>
  </Dimmer>
);
export default LoaderExample;