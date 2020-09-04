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
  Select,
  Header,
  Container,
} from "semantic-ui-react";
import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import NotLoggedIn from "../NotLoggedIn";
import unitFields from "../Resources/data/unitFields.js";
import resourceTypes from "../Resources/data/resourceTypes";
import Loader from "./Loader";
import GoogleWrapper from "../../google/GoogleWrapper";

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
      case "files":
        this.setState({ files: e.target.files });
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
          <Container>
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

              <FilePicker
                test="TEST"
                setFilesFromUppy={this.setFilesFromUppy}
              />
              {this.state.files.length > 0 ? (
                <div style={{ marginTop: "15px" }}>
                  <h5>Uploaded Files</h5>
                  <ul>
                    {this.state.files.map((file) => {
                      return <li key={file}>{file}</li>;
                    })}
                  </ul>
                </div>
              ) : null}
              {/* <GoogleWrapper
                googleCallback={(data) => this.googleCallback(data)}
              /> */}

              {/* <div>
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
              </div> */}
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
    console.log(e);
    e.preventDefault();

    const { description, name, unit, type, link } = this.state;

    let formData = new FormData();

    formData.append("description", description);
    // for (const key of Object.keys(this.state.files)) {
    //   formData.append("files", this.state.files[key]);
    // }
    // formData.append("files", files);
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
    } else {
      this.setState({ loaderActive: true, submitDisabled: true });
    }

    axios
      .post("/api/resources/create", formData)
      .then((res) => {
        console.log(res.data);
        axios.get(`/api/resources/${res.data._id}/votes/upvote`).then((res) => {
          this.setState({ loaderActive: false, submitDisabled: false });
          this.props.history.push({
            pathname: `/units/${unit}/${res.data.resource_id}`,
            state: { new_create_data: res.data },
          });
        });

        // access results...
      })
      .catch(function (error) {
        console.log(">> ERROR FILE UPLOAD ", error);
        alert(error.message);
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
