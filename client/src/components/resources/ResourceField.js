//ResourceField contains logic to render a single label
//and text input
import React from 'react';

export default ({ input, label, meta: { error, touched } }) => {
  return (
    <div>
      <label>{label}</label>
      <input {...input} style={{ marginBottom: '5px' }} />
      {/* If touched is true AND there's an error, return error */}
      {/* touched is boolean, and error is string. 
        If true, returns string. If false, stops the execution */}
      <div className="red-text" style={{ marginBottom: '20px' }}>
        {touched && error}
      </div>
    </div>
  );
};
