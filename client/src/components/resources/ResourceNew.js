//ResourceNew shows ResourceForm and ResourceFormReview
import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import ResourceForm from './ResourceForm';
import ResourceFormReview from './ResourceFormReview';

class ResourceNew extends Component {
  state = { showReview: false };

  renderContent() {
    if (this.state.showFormReview) {
      return (
        <ResourceFormReview
          onCancel={() => this.setState({ showFormReview: false })}
        />
      );
    }
    return (
      <ResourceForm
        onResourceSubmit={() => this.setState({ showFormReview: true })}
      />
    );
  }
  render() {
    return <div>{this.renderContent()}</div>;
  }
}

export default reduxForm({
  form: 'ResourceForm'
})(ResourceNew);
