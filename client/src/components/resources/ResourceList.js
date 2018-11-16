//ResourceList lists out all the resources from mongo
//will need to filter for diff pages

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchResources } from '../../actions';
import { Card } from 'semantic-ui-react';

class ResourceList extends Component {
  componentDidMount() {
    this.props.fetchResources();
  }

  renderResources() {
    return this.props.resources.reverse().map(resource => {
      return (
        <Card fluid key={resource.id} style={{ marginTop: '10px' }}>
          <div className="card-content">
            <span className="card-title">
              <i>{resource.name}</i>
            </span>
            <p>unit: {resource.unit}</p>
            <p>type: {resource.type}</p>
            <p>
              link: <a>{resource.link}</a>
            </p>
            <p className="right">
              Sent On: {new Date(resource.dateSent).toLocaleDateString()}
            </p>
          </div>
        </Card>
      );
    });
  }

  render() {
    return <div>{this.renderResources()}</div>;
  }
}

function mapStateToProps({ resources }) {
  return { resources };
}

export default connect(
  mapStateToProps,
  { fetchResources }
)(ResourceList);
