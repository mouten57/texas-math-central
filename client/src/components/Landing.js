import React from 'react';

import { Image } from 'semantic-ui-react';
import logo from '../images/logo.jpg';

const Landing = () => {
  return (
    <div>
      <div style={{ textAlign: 'center', height: '90vh' }}>
        <Image src={logo} size="large" circular centered />
      </div>
    </div>
  );
};

export default Landing;
