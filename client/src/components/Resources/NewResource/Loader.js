import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

const LoaderExample = (props) => (
  <Dimmer active={props.active} inverted>
    <Loader size={props.size} inline={props.inline}>
      Working...
    </Loader>
  </Dimmer>
);
export default LoaderExample;
