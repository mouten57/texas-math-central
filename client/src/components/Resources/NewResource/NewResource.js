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
import NotLoggedIn from "../../NotLoggedIn";
import unitFields from "../data/unitFields.js";
import resourceTypes from "../data/resourceTypes";
import gradeLevels from "../data/gradeLevels";
import subjects from "../data/subjects";
import Loader from "./Loader";
import GoogleWrapper from "./google/GoogleWrapper";
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
      link: "N/A",
      type: "",
      unit: "",
      fullUnit: "",
      name: "",
      subject: "",
      grade: "",
      hideLink: true,
      free: false,
      amountOfGoogleFiles: 0,
      googleFileIDs: [],
      googleRawData: {},
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
    const subject = this.state.subject.toLowerCase();
    if (unit) {
      var idx = unitFields[subject]
        .map(function (e) {
          return e.key;
        })
        .indexOf(data.value);

      if (idx > -1) {
        this.setState({
          unit: unitFields[subject][idx].param,
        });
      }
      this.setState({ fullUnit: data.value });
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
  googleCallback = (data) => {
    var googleId = data.docs[0].id;
    var size = data.docs.length;
    var googleFileIDs = [];
    for (let i in data.docs) {
      googleFileIDs.push(data.docs[i].id);
    }
    this.setState({
      amountOfGoogleFiles: size,
      googleFileIDs: googleFileIDs,
      googleRawData: data,
    });
    window.temp_props = undefined;
  };
  onDownloadFromGoogle(formData) {
    axios.post("/api/drive/download", formData);
  }
  transform = (unit) => {
    const subj = this.state.subject.toLowerCase();
    if (unit) {
      let idx = unitFields[subj]
        .map(function (e) {
          return e.param;
        })
        .indexOf(unit);
      if (idx > -1) {
        return unitFields[subj][idx].key;
      }
    }
  };
  renderForm() {
    const { subject } = this.state;
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
                      autoFocus
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
                  value={this.state.grade}
                  options={gradeLevels}
                  onSelect={this.onSelect}
                />

                <SelectOption
                  label="Subject"
                  placeholder="Select Subject"
                  name="subject"
                  value={this.state.subject}
                  options={subjects}
                  onSelect={this.onSelect}
                />
                <SelectOption
                  label="Unit"
                  placeholder="Select Unit"
                  name="unit"
                  value={this.transform(this.state.unit)}
                  options={unitFields[subject.toLowerCase()]}
                  onSelect={(e, data) => this.onSelect(e, data, "UNIT")}
                />
                <SelectOption
                  label="Type"
                  placeholder="Select Type"
                  name="type"
                  value={this.state.type}
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
                      checked={this.state.hideLink}
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
                  {this.props.auth.role == "admin" ? (
                    <div style={{ paddingTop: "10px" }}>
                      <Label>Price</Label>
                      <div>
                        <Checkbox
                          label="Is this a free resource?"
                          checked={this.state.free}
                          onClick={() =>
                            this.setState({
                              free: !this.state.free,
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : null}
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
              <GoogleWrapper
                googleCallback={(data) => {
                  this.googleCallback(data);
                }}
                amountOfFiles={this.state.amountOfGoogleFiles}
                data={this.state.googleRawData}
                onDownload={() =>
                  this.onDownloadFromGoogle(this.state.googleRawData)
                }
              />
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
          axios
            .get(`/api/resources/${res.data._id}/votes/upvote`)
            .then((res) => {
              //re-grab full list of resources at App.js
              this.props.fetchResources();
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
    return <div>{this.renderForm()}</div>;
  }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(mapStateToProps)(UploadForm);
