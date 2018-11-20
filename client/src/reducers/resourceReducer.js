import { FETCH_RESOURCE } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_RESOURCE:
      return action.payload;
    default:
      return state;
  }
}
