import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchResource } from '../../actions';
import { Container } from 'semantic-ui-react';
import _ from 'lodash';
class IndividualResource extends Component {
  constructor(props) {
    super(props);
    this.state = {
      resource: {}
    };
  }
  componentWillMount() {
    this.setState({
      resource: this.props.resources.filter(
        resource => resource._id === this.props.match.params.id
      )
    });
  }

  render() {
    return (
      <Container>
        <h2>IndividualResource</h2>
        {_.map(
          this.state.resource,
          ({ _id, name, unit, type, link, _user, dateSent }) => (
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
      </Container>
    );
  }
}

export default IndividualResource;

/* 
Goal here is to have a resource that's filtered based on it's id.
should be able to grab Id from the params.
Display link to actual resource and 


Should I fetch all resources or just one based on ID?
create new action, route, reducers, etc.
can call one single resource needed instead of doing filtering
client-side.

**It seems like if I connect to the redux store, I can pull
the already-fetched resources and filter from there**

Other option is to bring in all resources 
and just find the one I need. Definitely slower, 
but how much slower really?

*/
