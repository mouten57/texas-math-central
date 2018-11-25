import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import _ from 'lodash';
import axios from 'axios';

class IndividualResource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: {}
    };
  }
  componentWillMount() {
    axios.get(`/api/resources/${this.props.match.params.id}`).then(res => {
      const resource = res.data;
      this.setState({
        resource
      });
    });
  }

  downloadLink() {
    switch (this.state.resource) {
      case null:
        return <p>Error</p>;
      case false:
        return <p>Download not available.</p>;
      default:
        let link = `/api/resources/${this.props.match.params.id}/download`;
        return (
          <a href={link} download>
            Download File
          </a>
        );
    }
  }

  render() {
    return (
      <Container>
        <h2>IndividualResource</h2>
        {_.map(
          this.state.resource,
          ({ _id, name, unit, type, link, _user }) => (
            <div key={_id}>
              <p>
                <b>Name: </b>
                {name}
              </p>
              <p>
                <b>Unit:</b> {unit}
              </p>
              <p>
                <b>type:</b> {type}
              </p>
              <p>
                <b>Link: </b>{' '}
                <a href={link} target="_blank" rel="noopener noreferrer">
                  {link}
                </a>
              </p>
              <p>
                <b>Uploader:</b> {_user}
              </p>
            </div>
          )
        )}
        <div>
          <p>
            <b>Download: </b> {this.downloadLink()}
          </p>
        </div>
      </Container>
    );
  }
}

export default IndividualResource;
