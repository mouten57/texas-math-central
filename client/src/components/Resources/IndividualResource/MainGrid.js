import React from "react";
import { Grid, Image } from "semantic-ui-react";
import RenderCartOptions from "./RenderCartOptions";
import downloadLink from "./downloadLink";

import img from "../../../images/sample_doc.png";

const MainGrid = (props) => {
  const {
    resource,
    onAddRemoveCart,
    auth,
    state,
    authorized_to_view,
    leftColWidth,
    rightColWidth,
    iframeheight,
    iframewidth,
  } = props;
  const selectedFile = state?.selectedFile;
  const mimetype = selectedFile?.mimetype;
  return (
    <Grid compact>
      <Grid.Column width={leftColWidth}>
        <h2>{resource.name}</h2>

        <RenderCartOptions
          onAddRemoveCart={onAddRemoveCart}
          resource={resource}
          auth={auth}
          state={state}
        />

        <p>
          <b>Name: </b>
          {resource.name}
        </p>

        <p>
          <b>Grade Level: </b>
          {resource.grade}
        </p>

        <p>
          <b>Subject: </b>
          {resource.subject}
        </p>
        <p>
          <b>Unit:</b> {resource.fullUnit}
        </p>
        <p>
          <b>Type:</b> {resource.type}
        </p>
        {resource.link == "N/A" ? null : (
          <p>
            <b>Link: </b>{" "}
            <a href={resource.link} target="_blank" rel="noopener noreferrer">
              {resource.link}
            </a>
          </p>
        )}
        <p>
          {" "}
          <b>Uploader:</b> {resource._user ? resource._user.name : null}{" "}
        </p>
        <p>
          {" "}
          <b>Description:</b> {resource?.description}{" "}
        </p>
        <div>
          <b>
            Files{" "}
            {state.resource.files?.length > 0
              ? state.resource.files[0] == "TBD"
                ? null
                : " (click to preview)"
              : null}
            :{" "}
          </b>{" "}
          {downloadLink(state, (err, selectedFile) => {
            props.setSelectedFile(selectedFile);
          })}
        </div>
      </Grid.Column>
      <Grid.Column width={rightColWidth}>
        {state.selectedFile ? (
          state.selectedFile == "TBD" ? null : (
            <p style={{ textAlign: "center" }}>
              <b>
                Preview
                <a href={authorized_to_view ? state.selectedFile.s3Link : null}>
                  {` (${state.selectedFile.originalname})`}
                </a>
              </b>
              {mimetype.includes("image") ? (
                <Image src={selectedFile.s3Link} size="large" />
              ) : (
                <embed
                  src={`https://docs.google.com/gview?url=${state.selectedFile.previewLink}&embedded=true`}
                  style={{
                    marginTop: "10px",
                    height: iframeheight,
                    width: iframewidth,
                  }}
                  frameborder="0"
                />
              )}
            </p>
          )
        ) : null}
      </Grid.Column>
    </Grid>
  );
};

export default MainGrid;
