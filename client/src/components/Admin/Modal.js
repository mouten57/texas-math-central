import React from "react";
import { Modal, Button, Image, Header } from "semantic-ui-react";

const AdminModal = (props) => {
  const { setOpen, open, data, user_or_resource } = props;

  const renderUserModal = () => {
    return (
      <>
        <Modal.Content image>
          <Image size="medium" src={data?.image} wrapped />
          <Modal.Description>
            <Header>Role: {data?.role}</Header>
            {data?.token ? (
              <p style={{ maxWidth: "500px", overflow: "hidden" }}>
                <b>User Token</b>: {data?.token}
              </p>
            ) : null}
            <p>
              <b>Email</b>: {data?.email}
            </p>
            <div>
              <h5>Resources:</h5>
              <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {data?.resources.length > 0
                  ? data.resources.map((resource) => {
                      return (
                        <li key={resource._id}>
                          <a href={`/units/${resource.unit}/${resource._id}`}>
                            {resource.name}
                          </a>
                        </li>
                      );
                    })
                  : "None"}
              </ul>

              <h5>Comments:</h5>
              <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {data?.comments.length > 0
                  ? data.comments.map((comment) => {
                      return (
                        <li key={comment._id}>
                          "{comment.body}" on{" "}
                          <a
                            href={`/units/${comment.resource_id.unit}/${comment.resource_id._id}`}
                          >
                            {comment.resource_id.name}
                          </a>
                        </li>
                      );
                    })
                  : "None"}
              </ul>
              <h5>Purchased Resources:</h5>
              <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                {data?.purchasedResources.length > 0
                  ? data.purchasedResources.map((resource) => {
                      return (
                        <li key={resource._id}>
                          <a href={`/units/${resource.unit}/${resource._id}`}>
                            {resource.name}
                          </a>
                        </li>
                      );
                    })
                  : "None"}
              </ul>
            </div>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="black" onClick={() => setOpen(false)}>
            Ban User
          </Button>
          <Button
            content="Done"
            labelPosition="right"
            icon="checkmark"
            onClick={() => setOpen(false)}
            positive
          />
        </Modal.Actions>
      </>
    );
  };
  const renderResourceModal = (data) => {
    //console.log(data);
    if (data) {
      var {
        files,
        created_at,
        description,
        type,
        fullUnit,
        grade,
        link,
        votes,
        subject,
        type,
        _user,
        unit,
        _id,
      } = data;
    }
    const myFunc = (acc, curr) => {
      return Number(acc.value) + Number(curr.value);
    };
    //console.log(votes?.reduce(myFunc));
    return (
      <>
        <Modal.Content image style={{ marginRight: "15px" }}>
          {files?.length ? (
            <iframe
              src={`https://docs.google.com/gview?url=${files[0].previewLink}&embedded=true`}
              style={{ height: "300px" }}
              wrapped
            />
          ) : null}
          <Modal.Description>
            <Header>
              Grade {grade} {subject}/{fullUnit} {type}
            </Header>
            <p>{description}</p>

            <ul>
              {/* <li>Vote total: {votes?.reduce(myFunc)}</li> */}
              <li>Created on: {created_at}</li>
              <li>Created by: {_user?.name}</li>
              <li>Unit: {fullUnit}</li>
              <li>Subject: {subject}</li>
              <li>Type: {type}</li>

              <li>
                Link: <a href={link}>{link}</a>
              </li>
            </ul>
            <p>
              <a href={`/units/${unit}/${_id}`}>View Resource</a>
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="red" onClick={() => setOpen(false)}>
            Delete
          </Button>
          <Button
            content="Done"
            labelPosition="right"
            icon="checkmark"
            onClick={() => setOpen(false)}
            positive
          />
        </Modal.Actions>
      </>
    );
  };
  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Modal.Header>{data?.name}</Modal.Header>
      {user_or_resource == "user"
        ? renderUserModal()
        : renderResourceModal(data)}
    </Modal>
  );
};

export default AdminModal;
