//ResourceForm shows a form for a user to add input
import _ from "lodash";
import FilePicker from "./FilePicker/FilePicker";
import {
  Form,
  Button,
  TextArea,
  Input,
  Label,
  Segment,
  Checkbox,
  Header,
  Container,
  Select,
} from "semantic-ui-react";
import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import NotLoggedIn from "../NotLoggedIn";
import unitFields from "../Resources/data/unitFields.js";
import resourceTypes from "../Resources/data/resourceTypes";
import gradeLevels from "../Resources/data/gradeLevels";
import subjects from "../Resources/data/subjects";
import Loader from "./Loader";
import GoogleWrapper from "../../google/GoogleWrapper";
import SelectOption from "./SelectOption";
import onSubmitHelper from "./submitNew";

class UploadForm extends Component {
  constructor() {
    super();
    this.state = {
      loaderActive: false,
      submitDisabled: false,
      description: "",
      files: [],
      link: "https://www.",
      type: "",
      unit: "",
      name: "",
      subject: "",
      grade: "",
      hideLink: false,
    };
  }

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

  setFilesFromUppy = (action, file) => {
    let files = [...this.state.files];
    action == "add"
      ? files.push(file.name)
      : files.splice(files.indexOf(file), 1);
    this.setState({ files });
  };
  googleCallback = (googleId) => {
    console.log(`the user selected ${googleId}`);
    window.temp_props = undefined;
  };
  renderForm() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return <NotLoggedIn />;
      default:
        return (
          <Container style={{ marginBottom: "40px" }}>
            <Form style={{ marginBottom: "25px" }}>
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

                <SelectOption
                  label="Grade Level"
                  placeholder="Select Grade Level"
                  name="grade"
                  options={gradeLevels}
                  onSelect={this.onSelect}
                />

                <SelectOption
                  label="Subject"
                  placeholder="Select Subject"
                  name="subject"
                  options={subjects}
                  onSelect={this.onSelect}
                />
                <SelectOption
                  label="Unit"
                  placeholder="Select Unit"
                  name="unit"
                  options={unitFields}
                  onSelect={(e, data) => this.onSelect(e, data, "UNIT")}
                />
                <SelectOption
                  label="Type"
                  placeholder="Select Type"
                  name="type"
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
                        value={this.state.link}
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
                  <Loader active={this.state.loaderActive} />
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
            </Form>
            <Segment
              style={
                this.state.loaderActive
                  ? { display: "none" }
                  : { display: "inherit" }
              }
            >
              <Header>Upload</Header>
              <div>
                <Label>Upload File</Label>
                <div>
                  <Input
                    type="file"
                    multiple
                    name="files"
                    fluid
                    onChange={this.onChange}
                  />
                </div>
              </div>

              {/* <FilePicker
                test="TEST"
                setFilesFromUppy={this.setFilesFromUppy}
              /> */}
              {this.state.files.length > 0 ? (
                <div style={{ marginTop: "15px" }}>
                  <h5>Selected Files</h5>
                  <ul>
                    {Array.from(this.state.files).map((file) => {
                      return <li key={file.name}>{file.name}</li>;
                    })}
                  </ul>
                </div>
              ) : null}
              {/* <GoogleWrapper
                googleCallback={(data) => this.googleCallback(data)}
              /> */}
            </Segment>

            <Button
              onClick={this.onSubmit}
              style={{ marginTop: "5px" }}
              disabled={this.state.submitDisabled}
            >
              Submit
            </Button>
          </Container>
        );
    }
  }
  onSubmit = (e) => {
    onSubmitHelper(e, this.state, (err, formData) => {
      this.setState({ loaderActive: true, submitDisabled: true });
      axios
        .post("/api/resources/create", formData)
        .then((res) => {
          //re-grab full list of resources at App.js
          this.props.fetchResources();
          axios
            .get(`/api/resources/${res.data._id}/votes/upvote`)
            .then((res) => {
              this.setState({ loaderActive: false, submitDisabled: false });
              this.props.history.push({
                pathname: `/units/${this.state.unit}/${res.data.resource_id}`,
                state: { new_create_data: res.data },
              });
            });

          // access results...
        })
        .catch(function (error) {
          console.log(">> ERROR FILE UPLOAD ", error);
          alert(error.message);
        });
    });
  };

  render() {
    console.log(this.state);
    return <div>{this.renderForm()}</div>;
  }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(mapStateToProps)(UploadForm);
