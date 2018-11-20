//ResourceForm shows a form for a user to add input
import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import { Form } from 'semantic-ui-react';
import unitFields from './data/unitFields.js';
//import formFields from './data/formFields.js';
import resourceTypes from './data/resourceTypes';

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
    return (
      <div>
        <Form onSubmit={this.props.handleSubmit(this.props.onResourceSubmit)}>
          <label>Resource Name</label>

          <Field
            name="name"
            component="input"
            type="text"
            placeholder="quick quiz 2"
          />

          <div>
            <label>Unit</label>
            <div>
              <Field name="unit" component="select">
                {this.renderUnits()}
              </Field>
            </div>
          </div>

          <div>
            <label>Type</label>
            <div>
              <Field name="type" component="select" label="type">
                {this.renderTypes()}
              </Field>
            </div>
          </div>
          <div>
            <label>Link</label>
            <div>
              <Field
                name="link"
                component="input"
                type="text"
                placeholder="http://"
                label="link"
              />
            </div>
          </div>

          <div>
            <label>Description</label>
            <div>
              <Field name="description" component="textarea" />
            </div>
          </div>
          <button type="submit" className="teal btn-flat right white-text">
            Next
          </button>
        </Form>
      </div>
    );
  }
  render() {
    return <div>{this.renderFields()}</div>;
  }
}

// function validate(values) {
//   const errors = {};

//   _.each(formFields, ({ name, noValueError }) => {
//     if (!values[name]) {
//       errors[name] = noValueError;
//     }
//   });

//   return errors;
// }

export default reduxForm({
  //validate,
  form: 'resourceForm',
  //saves values for users when we click 'back'
  destroyOnUnmount: false
})(ResourceForm);
