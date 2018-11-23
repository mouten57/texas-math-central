import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import NotLoggedIn from '../NotLoggedIn';

class UploadForm extends Component {
  constructor() {
    super();
    this.state = {
      description: '',
      selectedFile: ''
    };
  }
  componentDidMount() {
    console.log(this.props);
  }

  onChange = e => {
    switch (e.target.name) {
      case 'selectedFile':
        this.setState({ selectedFile: e.target.files[0] });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };

  renderForm() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return <NotLoggedIn />;
      default:
        return (
          <form onSubmit={this.onSubmit}>
            <input
              type="text"
              name="description"
              placeholder="Description of file.."
              value={this.state.description}
              onChange={this.onChange}
            />
            <input type="file" name="selectedFile" onChange={this.onChange} />
            <button type="submit">Submit</button>
          </form>
        );
    }
  }

  onSubmit = e => {
    e.preventDefault();
    const { description, selectedFile } = this.state;
    let formData = new FormData();

    formData.append('description', description);
    formData.append('selectedFile', selectedFile);

    axios
      .post('/api/upload', formData)
      .then(result => {
        console.log('>> (onSubmit) file upload result = ', result);
        // access results...
      })
      .then(() => alert('SUCCESS!'))
      .then(() => this.props.history.push(`/units`))

      .catch(function(error) {
        console.log('>> ERROR FILE UPLAOD ', error);
        alert(
          'File upload failed. Please ensure you are uploading a .jpeg file only'
        );
      });
  };

  render() {
    return <div>{this.renderForm()}</div>;
  }
}

function mapStateToProps(state) {
  return { auth: state.auth };
}
export default connect(mapStateToProps)(UploadForm);
