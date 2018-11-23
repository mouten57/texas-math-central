//ResourceForm shows a form for a user to add input
import _ from 'lodash';
import React, { Component } from 'react';
import axios from 'axios';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { Form, Button, TextArea } from 'semantic-ui-react';
import unitFields from './data/unitFields.js';

import resourceTypes from './data/resourceTypes';
import NotLoggedIn from '../NotLoggedIn';

class ResourceForm extends Component {
  renderUnits() {
    return _.map(unitFields, ({ name, param }) => {
      return (
        <option key={name} value={param} label={name}>
          {name}
        </option>
      );
    });
  }

  renderTypes() {
    return resourceTypes.map(resource => {
      return (
        <option key={resource} value={resource}>
          {resource}
        </option>
      );
    });
  }
  renderFields() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return <NotLoggedIn />;
      default:
        return (
          <div>
            <Form onSubmit={e => this.onSubmit(e)}>
              <label>Resource Name</label>

              <input
                name="name"
                component="input"
                type="text"
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
                    type="text"
                    placeholder="http://"
                  />
                </div>
              </div>

              <div>
                <label>Description</label>
                <div>
                  <TextArea name="description" component="textarea" />
                </div>
              </div>
              <Button
                type="submit"
                className="teal btn-flat right white-text"
                style={{ marginTop: '10px' }}
              >
                Submit
              </Button>

              <Link to="/upload">
                <Button floated="right" style={{ marginTop: '10px' }}>
                  Prefer to Upload?
                </Button>
              </Link>
            </Form>
          </div>
        );
    }
  }

  onSubmit(event) {
    event.preventDefault();

    let values = { name: '', unit: '', type: '', link: '', description: '' };
    values.name = event.target.elements.name.value;
    values.unit = event.target.elements.unit.value;
    values.type = event.target.elements.type.value;
    values.link = event.target.elements.link.value;
    values.description = event.target.elements.description.value;

    let ObjVals = Object.values(values);
    for (let i in ObjVals) {
      if (ObjVals[i] === '') {
        return alert('Please complete all fields.');
      }
    }

    axios.post('/api/resources/create', values);
    this.props.history.push('/units');
    alert('Success!');
  }
  render() {
    return <div>{this.renderFields()}</div>;
  }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}

export default connect(mapStateToProps)(withRouter(ResourceForm));
