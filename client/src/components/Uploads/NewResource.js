//ResourceForm shows a form for a user to add input
import _ from 'lodash';
import { Form, Button, TextArea } from 'semantic-ui-react';
import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import NotLoggedIn from '../NotLoggedIn';
import unitFields from '../resources/data/unitFields.js';

import resourceTypes from '../resources/data/resourceTypes';

class UploadForm extends Component {
  constructor() {
    super();
    this.state = {
      description: '',
      imageFile: '',
      link: '',
      type: '',
      unit: '',
      name: ''
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
    return resourceTypes.map(resource => {
      return (
        <option key={resource} value={resource} onChange={this.onChange}>
          {resource}
        </option>
      );
    });
  }

  onChange = e => {
    switch (e.target.name) {
      case 'imageFile':
        this.setState({ imageFile: e.target.files[0] });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
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
            <label>Resource Name</label>

            <input
              name="name"
              component="input"
              value={this.state.name}
              onChange={this.onChange}
              placeholder="quick quiz 2"
            />

            <div>
              <label>Unit</label>
              <div>
                <select name="unit" label="unit">
                  {this.renderUnits()}
                </select>
              </div>
            </div>

            <div>
              <label>Type</label>
              <div>
                <select name="type" label="type">
                  {this.renderTypes()}
                </select>
              </div>
            </div>
            <div>
              <label>Link</label>
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

            <div>
              <label>Description</label>
              <div>
                <TextArea
                  name="description"
                  component="textarea"
                  value={this.state.description}
                  onChange={this.onChange}
                />
              </div>
            </div>
            <div>
              <label>
                Upload JPG
                <div>
                  <input
                    type="file"
                    name="imageFile"
                    onChange={this.onChange}
                  />
                </div>
              </label>
            </div>

            <div>
              <label>Upload Other (coming soon!)</label>
              <div>
                <input
                  type="file"
                  name="otherFile"
                  onChange={this.onChange}
                  disabled
                />
              </div>
            </div>

            <Button
              type="submit"
              className="teal btn-flat right white-text"
              style={{ marginTop: '10px' }}
            >
              Submit
            </Button>
          </Form>
        );
    }
  }
  isURL = str => {
    var pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
    if (pattern.test(str)) {
      return true;
    }
    alert("Url is not valid! Make sure you start with 'http://...'");
    return false;
  };

  onSubmit = e => {
    e.preventDefault();
    const { description, imageFile, name, link } = this.state;
    let unit, type;
    unit = e.target.elements.unit.value;
    type = e.target.elements.type.value;
    let formData = new FormData();

    formData.append('description', description);
    formData.append('imageFile', imageFile);
    formData.append('name', name);
    formData.append('unit', unit);
    formData.append('type', type);
    formData.append('link', link);

    let values = [];
    for (var value of formData.values()) {
      values.push(value);
    }
    values.splice(1, 1);

    if (values.includes('') === true) {
      return alert(`                Please complete all fields. 

                  (File upload is optional)`);
    }

    if (this.isURL(values[4]) === false) return;

    axios
      .post('/api/resources/create', formData)
      .then(result => {
        console.log('>> (onSubmit) file upload result = ', result);
        // access results...
      })
      .then(() => alert('SUCCESS!'))
      .then(() => this.props.history.push(`/units`))

      .catch(function(error) {
        console.log('>> ERROR FILE UPLAOD ', error);
        alert(
          'File upload failed. Please ensure you are uploading a .jpeg file only'
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
