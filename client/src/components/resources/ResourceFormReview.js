//ResourceFormReview shows users their form inputs for review
import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import formFields from './data/formFields.js';
import { withRouter } from 'react-router-dom';
import * as actions from '../../actions';

const ResourceFormReview = ({
  onCancel,
  formValues,
  submitResource,
  history
}) => {
  const reviewFields = _.map(formFields, ({ name, label }) => {
    console.log(formValues);
    return (
      <div key={name}>
        <label>
          <b>{label}</b>
        </label>
        <div>{formValues[name]}</div>
      </div>
    );
  });

  return (
    <div>
      <h5>Please confirm your entries.</h5>
      {reviewFields}
      <button
        className="yellow darken-3 white-text btn-flat"
        onClick={onCancel}
      >
        Back
      </button>
      <button
        onClick={() => submitResource(formValues, history)}
        className="green btn-flat right white-text"
      >
        Add Resource
      </button>
    </div>
  );
};

function mapStateToProps(state) {
  return { formValues: state.form.resourceForm.values };
}

export default connect(
  mapStateToProps,
  actions
)(withRouter(ResourceFormReview));
