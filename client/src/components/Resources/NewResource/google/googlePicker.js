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

// Use the Google API Loader script to load the google.picker script.
export default function loadPicker(props) {
  window.temp_props = props;
  window.gapi.load("auth", { callback: onAuthApiLoad });
  window.gapi.load("picker", { callback: onPickerApiLoad });
}

function onAuthApiLoad() {
  window.gapi.auth.authorize(
    {
      client_id: clientId,
      scope: scope,
      immediate: false,
    },
    handleAuthResult
  );
}

function onPickerApiLoad(props) {
  pickerApiLoaded = true;
  createPicker(props);
}

function handleAuthResult(authResult, props) {
  if (authResult && !authResult.error) {
    oauthToken = authResult.access_token;
    createPicker(props);
  }
}

// Create and render a Picker object for searching images.
function createPicker(props) {
  if (pickerApiLoaded && oauthToken) {
    var view = new window.google.picker.View(window.google.picker.ViewId.DOCS);
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
      .setCallback(pickerCallback)
      .build();
    picker.setVisible(true);
  }
}

// A simple callback implementation.
function pickerCallback(data) {
  if (data.action == window.google.picker.Action.PICKED) {
    var fileId = data.docs[0].id;
    window.temp_props.googleCallback(fileId);
    alert("The user selected: " + fileId);
  }
}
