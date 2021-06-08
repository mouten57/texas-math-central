import React, { Component } from "react";
import axios from "axios";
import { Button } from "semantic-ui-react";
// The Browser API key obtained from the Google API Console.
// Replace with your own Browser API key, or your own key.
var developerKey = process.env.REACT_APP_GOOGLE_DEVELOPER_KEY;
// The Client ID obtained from the Google API Console. Replace with your own Client ID.
var clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
// Replace with your own project number from console.developers.google.com.
// See "Project number" under "IAM & Admin" > "Settings"
var appId = process.env.REACT_APP_GOOGLE_APP_ID;
// Scope to use to access user's Drive items.
var scope = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.appdata",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.metadata",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.photos.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
];

var oauthToken;

class GoogleWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      pickerApiLoaded: false,
    };
  }

  // Use the Google API Loader script to load the google.picker script.
  loadPicker = (props) => {
    window.gapi.load("auth", { callback: this.onAuthApiLoad });
    window.gapi.load("picker", { callback: this.onPickerApiLoad });
  };

  onAuthApiLoad = () => {
    if (this.state.oauthToken) {
      return this.handleAuthResult({ access_token: this.state.oauthToken });
    } else {
      window.gapi.auth.authorize(
        {
          client_id: clientId,
          scope: scope,
          immediate: false,
        },
        this.handleAuthResult
      );
    }
  };

  onPickerApiLoad = () => {
    this.setState({ pickerApiLoaded: true });
    if (!this.state.open) {
      this.createPicker();
    }
  };

  handleAuthResult = (authResult) => {
    if (authResult && !authResult.error) {
      oauthToken = authResult.access_token;
      this.setState({ oauthToken });
      axios.post("/auth/drive", authResult).then((res) => {});
      if (!this.state.open && authResult.token_type) {
        this.createPicker();
      }
    }
  };

  // Create and render a Picker object for searching images.
  createPicker = () => {
    if (this.state.pickerApiLoaded && oauthToken && !this.state.open) {
      this.setState({ open: true });
      var view = new window.google.picker.View(
        window.google.picker.ViewId.DOCS
      );
      var docsView = new window.google.picker.DocsView()
        .setIncludeFolders(true)
        .setSelectFolderEnabled(false);

      var picker = new window.google.picker.PickerBuilder()
        .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
        .setMaxItems(5)
        .setAppId(appId)
        .setOAuthToken(oauthToken)
        .addView(docsView)
        // .addView(docsView)
        .setDeveloperKey(developerKey)
        .setCallback(this.pickerCallback)
        .build();
      picker.setVisible(true);
    }
  };
  // A simple callback implementation.
  pickerCallback = (data) => {
    if (data.action == window.google.picker.Action.PICKED) {
      var fileId = data.docs[0].id;
      //here or in googleCallback is where I need to download files
      //need to be able to show on UI which files were selected
      //probably need to send IDs to server to interpret and provide names and prep download
      // this.props.googleCallback(fileId);
      this.props.googleCallback(data);
      this.setState({ open: false });
    } else if (data.action == window.google.picker.Action.CANCEL) {
      this.setState({ open: false });
    }
  };

  render() {
    console.log(this.state);
    return (
      <div>
        {/* Group one */}
        <div
          className="one"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginTop: "7px",
          }}
        >
          <Button onClick={this.loadPicker}>Add from Drive</Button>
         {this.props.amountOfFiles > 0 ? (
           null
          // <Button onClick={this.props.onDownload} >
          //   Download Selected Files
          // </Button>
        ) : null}
        </div>

        {/* Group two */}

       
        
      </div>
    );
  }
}
export default GoogleWrapper;
