import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Texas Math Central</h1>
      <Button variant="contained" color="primary">
        <a href="http://localhost:5000/">VIEW RESOURCES</a>
      </Button>
    </div>
  );
};

export default Landing;
