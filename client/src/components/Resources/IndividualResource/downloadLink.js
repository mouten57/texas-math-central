import React from "react";
import { Loader } from "semantic-ui-react";

const downloadLink = (props) => {
  const { files, cb } = props;
  switch (files?.length) {
    case null:
      return "";

    case 0:
      return "Download not available.";

    case 1:
      //if index 0 of files is "TBD", that means we are still waiting for s3 upload to complete
      if (files[0] == "TBD") {
        return (
          <Loader active inline="centered">
            Fetching a personal preview
          </Loader>
        );
      }

    default:
      return (
        <ul style={{ listStyle: "none", marginTop: "5px", paddingLeft: 0 }}>
          {files?.map((file, i) => {
            //use this if storing/downloading files directly from mongo db
            //let link = `/api/units/${this.props.match.params.unit}/${this.props.match.params.id}/download/${file.filename}`;
            //use this with s3
            // let link = file.s3Link;
            return (
              <li
                key={i}
                className="file_selector"
                onClick={() => cb(null, file)}
                style={{
                  paddingTop: "10px",
                }}
              >
                {file.originalname || file.name}
              </li>
            );
          })}
        </ul>
      );
  }
};

export default downloadLink;
