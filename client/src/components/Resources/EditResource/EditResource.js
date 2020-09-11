import React, { Component } from "react";
import {
  Form,
  Segment,
  Button,
  Label,
  Input,
  Checkbox,
  Loader,
  TextArea,
} from "semantic-ui-react";
import SelectOption from "../../Uploads/SelectOption";
import gradeLevels from "../data/gradeLevels";
import subjects from "../data/subjects";
import unitFields from "../data/unitFields";
import resourceTypes from "../data/resourceTypes";

class EditItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = props.editData;
  }
  //   componentDidMount() {
  //     let resource = this.props.editData;
  //     this.setState({
  //       resource,
  //     });
  //   }

  onChange = (e) => {
    switch (e.target.name) {
      case "files":
        this.setState({ files: e.target.files });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };

  onSelect = (e, data, unit) => {
    if (unit) {
      var idx = unitFields
        .map(function (e) {
          return e.key;
        })
        .indexOf(data.value);

      if (idx > -1) {
        this.setState({
          unit: unitFields[idx].param,
        });
      }
    } else {
      this.setState({
        [data.name]: data.value,
      });
    }
  };

  transform = (unit) => {
    let idx = unitFields
      .map(function (e) {
        return e.param;
      })
      .indexOf(unit);

    return unitFields[idx].key;
  };

  render() {
    console.log(this.state);
    const { name, grade, subject, unit, type, link, description } =
      this.state || false;
    return (
      <Form style={{ marginBottom: "25px" }}>
        <Segment raised>
          <div>
            <Label>Resource Name</Label>
            <div>
              <Input
                name="name"
                component="input"
                fluid
                value={name}
                onChange={this.onChange}
                placeholder="Resource Name"
              />
            </div>
          </div>

          <SelectOption
            label="Grade Level"
            placeholder="Select Grade Level"
            name="grade"
            value={grade}
            options={gradeLevels}
            onSelect={this.onSelect}
          />

          <SelectOption
            label="Subject"
            placeholder="Select Subject"
            name="subject"
            value={subject}
            options={subjects}
            onSelect={this.onSelect}
          />
          <SelectOption
            label="Unit"
            placeholder="Select Unit"
            name="unit"
            value={this.transform(unit)}
            options={unitFields}
            onSelect={(e, data) => this.onSelect(e, data, "UNIT")}
          />
          <SelectOption
            label="Type"
            placeholder="Select Type"
            name="type"
            value={type}
            options={resourceTypes}
            onSelect={this.onSelect}
          />

          <div style={{ paddingTop: "10px" }}>
            <Label>Link</Label>
            <div>
              {!this.state.hideLink ? (
                <Form.Input
                  name="link"
                  component="input"
                  placeholder="http://"
                  value={link}
                  onChange={this.onChange}
                />
              ) : null}
              <Checkbox
                label="Link not available"
                onClick={() =>
                  this.setState({
                    hideLink: !this.state.hideLink,
                    link: !this.state.hideLink ? "N/A" : "https://www.",
                  })
                }
              />
            </div>
          </div>

          <div style={{ paddingTop: "10px" }}>
            <Label>Description</Label>

            <div>
              <TextArea
                name="description"
                component="textarea"
                placeholder="Something noteworthy..."
                value={description}
                onChange={this.onChange}
              />
            </div>
          </div>
        </Segment>
        <Form.Group inline widths="equal">
          <Form.Field
            control={Button}
            color="teal"
            fluid
            onClick={(e) => this.props.updateResource(this.state)}
          >
            Save
          </Form.Field>

          <Form.Field
            control={Button}
            color="teal"
            fluid
            onClick={this.props.cancelEdit}
          >
            Cancel
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

export default EditItemForm;
