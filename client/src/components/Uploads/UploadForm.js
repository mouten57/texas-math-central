import React, { Component } from 'react';
import axios from 'axios';

class UserForm extends Component {
  constructor() {
    super();
    this.state = {
      description: '',
      selectedFile: ''
    };
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

  onSubmit = e => {
    e.preventDefault();
    const { description, selectedFile } = this.state;
    let formData = new FormData();

    formData.append('description', description);
    formData.append('selectedFile', selectedFile);

    console.log('form data ', formData);

    axios
      .post('/api/upload', formData)
      .then(result => {
        console.log('>> (onSubmit) file upload result = ', result);
        // access results...
      })
      .catch(function(error) {
        console.log('>> ERROR FILE UPLAOD ', error);
        alert(
          'File upload failed. Please ensure you are uploading a .jpeg file only'
        );
      });
  };

  render() {
    const { description, selectedFile } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <input
          type="text"
          name="description"
          value={description}
          onChange={this.onChange}
        />
        <input type="file" name="selectedFile" onChange={this.onChange} />
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default UserForm;
