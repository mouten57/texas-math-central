import React, { Component } from 'react';

class IndividualResource extends Component {
  render() {
    return <h2>IndividualResource</h2>;
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
