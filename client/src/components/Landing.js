import React from "react";
import Trending from "./Trending/Trending";

import { Image } from "semantic-ui-react";
import logo from "../images/logo.jpg";

const Landing = () => {
  return (
    <div>
      <div style={{ textAlign: "center" }}>
        <Image src={logo} centered fluid />
      </div>
      {/* <Trending /> */}
    </div>
  );
};

export default Landing;
