//ResourceForm shows a form for a user to add input
import _ from 'lodash';
import React, { Component } from 'react';
import { reduxForm, Field } from 'redux-form';
import unitFields from './data/unitFields.js';
import formFields from './data/formFields.js';

class ResourceForm extends Component {
  renderUnits() {
    return _.map(unitFields, ({ name }) => {
      return (
        <option key={name} value={name}>
          {name}
        </option>
      );
    });
  }
  renderFields(props) {
    return (
      <div>
        <form onSubmit={this.props.handleSubmit(this.props.onResourceSubmit)}>
          <div>
            <label>Resource Name</label>
            <div>
              <Field
                name="name"
                component="input"
                type="text"
                placeholder="quick quiz 2"
              />
            </div>
            <div>
              <label>Unit</label>
              <div>
                <Field name="unit" component="select">
                  <option />
                  {this.renderUnits()}
                </Field>
              </div>
            </div>
          </div>

          <div>
            <label>Type</label>
            <div>
              <label>
                <Field
                  name="type"
                  component="input"
                  type="radio"
                  value="link"
                />{' '}
                Link
              </label>
              <label>
                <Field
                  name="type"
                  component="input"
                  type="radio"
                  value="upload"
                />{' '}
                Upload
              </label>
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
        </form>
      </div>
    );
  }
  render() {
    return <div>{this.renderFields()}</div>;
  }
}

function validate(values) {
  const errors = {};

  _.each(formFields, ({ name, noValueError }) => {
    if (!values[name]) {
      errors[name] = noValueError;
    }
  });

  return errors;
}

export default reduxForm({
  validate,
  form: 'resourceForm',
  //saves values for users when we click 'back'
  destroyOnUnmount: false
})(ResourceForm);
