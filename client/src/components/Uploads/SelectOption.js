import React from "react";
import { Form, Label } from "semantic-ui-react";

const SelectOption = (props) => {
  const { options, label, name, placeholder, onSelect, value } = props;
  return (
    <div style={{ paddingTop: "10px" }}>
      <Label>{label}</Label>
      <Form.Select
        value="K"
        placeholder={value}
        fluid
        name={name}
        search
        selection
        options={options}
        onChange={onSelect}
      />
    </div>
  );
};

export default SelectOption;
