import React from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import GoogleDrive from "@uppy/google-drive";
import { Button } from "semantic-ui-react";
import { DashboardModal } from "@uppy/react";

class UploadButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
    };

    this.uppy = new Uppy()
      .use(XHRUpload, {
        endpoint: "/api/upload",
        fieldName: "my_file",
      })
      .use(GoogleDrive, {
        companionUrl: "http://localhost:5000/",
      });

    this.uppy.on("file-added", (file) => {
      console.log(file);
      this.props.setFilesFromUppy("add", file);
    });
    this.uppy.on("file-removed", (file, reason) => {
      console.log("Removed file", file);
      this.props.setFilesFromUppy("remove", file);
    });

    this.uppy.on("upload", (data) => {
      console.log(data);
    });

    this.uppy.on("complete", (result) => {
      setTimeout(() => this.setState({ modalOpen: false }), 1000);
    });
  }

  componentWillUnmount() {
    this.uppy.close();
  }

  handleOpen = () => {
    this.setState({
      modalOpen: true,
    });
  };

  handleClose = () => {
    this.setState({
      modalOpen: false,
    });
  };

  render() {
    return (
      <div>
        <Button onClick={this.handleOpen}>Upload File</Button>
        <DashboardModal
          uppy={this.uppy}
          closeModalOnClickOutside
          open={this.state.modalOpen}
          onRequestClose={this.handleClose}
          // plugins={["GoogleDrive"]}
        />
      </div>
    );
  }
}
export default UploadButton;
