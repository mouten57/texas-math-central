import React, { Component } from "react";
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
var scope = ["https://www.googleapis.com/auth/drive.readonly"];
var pickerApiLoaded = false;
var oauthToken;

class GoogleWrapper extends Component {
  constructor(props) {
    super(props);
  }

  // Use the Google API Loader script to load the google.picker script.
  loadPicker = (props) => {
    window.temp_props = props;
    window.gapi.load("auth", { callback: this.onAuthApiLoad });
    window.gapi.load("picker", { callback: this.onPickerApiLoad });
  };

  onAuthApiLoad = () => {
    window.gapi.auth.authorize(
      {
        client_id: clientId,
        scope: scope,
        immediate: false,
      },
      this.handleAuthResult
    );
  };

  onPickerApiLoad = (props) => {
    pickerApiLoaded = true;
    this.createPicker(props);
  };

  handleAuthResult = (authResult, props) => {
    console.log("authResult:", authResult);
    if (authResult && !authResult.error) {
      oauthToken = authResult.access_token;
      this.createPicker(props);
    }
  };

  // Create and render a Picker object for searching images.
  createPicker = (props) => {
    if (pickerApiLoaded && oauthToken) {
      var view = new window.google.picker.View(
        window.google.picker.ViewId.DOCS
      );
      var docsView = new window.google.picker.DocsView()
        .setIncludeFolders(true)
        .setSelectFolderEnabled(true);

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
    console.log(data);
    if (data.action == window.google.picker.Action.PICKED) {
      var fileId = data.docs[0].id;
      this.props.googleCallback(fileId);
      alert("The user selected: " + fileId);
    }
  };

  render() {
    console.log(this.props);
    return <Button onClick={this.loadPicker}>Add from Drive</Button>;
  }
}
export default GoogleWrapper;
// const googleWrapper = (props) => {
//   return (
//     <Button onClick={() => loadPicker(props)} style={{ marginTop: "15px" }}>
//       Upload From Google Drive
//     </Button>
//   );
// };
