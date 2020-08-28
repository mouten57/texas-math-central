//ResourceForm shows a form for a user to add input
import _ from "lodash";
import {
  Form,
  Button,
  TextArea,
  Input,
  Label,
  Segment,
  Select,
  Header,
} from "semantic-ui-react";
import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import NotLoggedIn from "../NotLoggedIn";
import unitFields from "../resources/data/unitFields.js";
import resourceTypes from "../resources/data/resourceTypes";

class UploadForm extends Component {
  constructor() {
    super();
    this.state = {
      description: "",
      imageFile: "",
      link: "https://www.",
      type: "",
      unit: "",
      name: "",
    };
  }
  renderUnits() {
    return _.map(unitFields, ({ name, param }) => {
      return (
        <option key={name} value={param} label={name} onChange={this.onChange}>
          {name}
        </option>
      );
    });
  }
  renderTypes() {
    return resourceTypes.map((type) => {
      return (
        <option key={type} value={type} onChange={this.onChange}>
          {type}
        </option>
      );
    });
  }

  onChange = (e) => {
    switch (e.target.name) {
      case "imageFile":
        this.setState({ imageFile: e.target.files[0] });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };

  onSelectUnit = (e) => {
    var plainName = e.currentTarget.getElementsByClassName("text")[0].innerText;
    let idx = unitFields
      .map(function (e) {
        return e.name;
      })
      .indexOf(plainName);
    this.setState({
      unit: unitFields[idx].param,
    });
  };
  onSelectResourceType = (e) => {
    var type = e.currentTarget.getElementsByClassName("text")[0].innerText;
    this.setState({
      type,
    });
  };

  renderForm() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return <NotLoggedIn />;
      default:
        return (
          <Form onSubmit={this.onSubmit}>
            <Segment>
              <Header>Create a New Resource!</Header>
              <div>
                <Label>Resource Name</Label>
                <div>
                  <Input
                    name="name"
                    component="input"
                    fluid
                    value={this.state.name}
                    onChange={this.onChange}
                    placeholder="Resource Name"
                  />
                </div>
              </div>

              <div style={{ paddingTop: "10px" }}>
                <Label>Unit</Label>
                <Select
                  placeholder="Select Type"
                  fluid
                  selection
                  options={unitFields}
                  onChange={this.onSelectUnit}
                />
              </div>

              <div style={{ paddingTop: "10px" }}>
                <Label>Type</Label>
                <Select
                  placeholder="Select Type"
                  fluid
                  selection
                  options={resourceTypes}
                  onChange={this.onSelectResourceType}
                />
              </div>
              <div style={{ paddingTop: "10px" }}>
                <Label>Link</Label>
                <div>
                  <Form.Input
                    name="link"
                    component="input"
                    placeholder="http://"
                    value={this.state.link}
                    onChange={this.onChange}
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
                    value={this.state.description}
                    onChange={this.onChange}
                  />
                </div>
              </div>
            </Segment>
            <Segment>
              <Header>Upload</Header>
              <div>
                <Label>Upload JPG</Label>
                <div>
                  <Input
                    type="file"
                    name="imageFile"
                    onChange={this.onChange}
                  />
                </div>
              </div>

              <div style={{ paddingTop: "10px" }}>
                <Label>Upload Other (coming soon!)</Label>
                <div>
                  <Input
                    type="file"
                    name="otherFile"
                    onChange={this.onChange}
                    disabled
                  />
                </div>
              </div>
            </Segment>

            <Button type="submit" style={{ marginTop: "5px" }}>
              Submit
            </Button>
          </Form>
        );
    }
  }
  isURL = (str) => {
    var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (pattern.test(str)) {
      return true;
    }
    alert("Url is not valid! Make sure you start with 'http://...'");
    return false;
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { description, imageFile, name, unit, type, link } = this.state;

    let formData = new FormData();

    formData.append("description", description);
    formData.append("imageFile", imageFile);
    formData.append("name", name);
    formData.append("unit", unit);
    formData.append("type", type);
    formData.append("link", link);

    let values = [];
    for (var value of formData.values()) {
      values.push(value);
    }
    values.splice(1, 1);

    if (values.includes("") === true) {
      return alert(`                Please complete all fields. 

                  (File upload is optional)`);
    }

    if (this.isURL(values[4]) === false) return;

    axios
      .post("/api/resources/create", formData)
      .then((result) => {
        console.log(">> (onSubmit) file upload result = ", result);
        // access results...
      })
      .then(() => alert("SUCCESS!"))
      .then(() => this.props.history.push(`/units/${unit}`))

      .catch(function (error) {
        console.log(">> ERROR FILE UPLAOD ", error);
        alert(
          "File upload failed. Please ensure you are uploading a .jpeg file only"
        );
      });
  };

  render() {
    return <div>{this.renderForm()}</div>;
  }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(mapStateToProps)(UploadForm);
