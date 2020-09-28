import React from "react";
import { Link } from "react-router-dom";
import { Grid, Table, Confirm, Icon } from "semantic-ui-react";

const MobileView = (props) => {
  const {
    Media,
    handleSort,
    match,
    data,
    show,
    direction,
    column,
    open,
    auth,
    handleCancel,
    handleConfirm,
  } = props;
  return (
    <Grid.Column as={Media} at="mobile">
      <Table
        style={{ marginBottom: "40px" }}
        unstackable
        sortable
        striped
        compact
        fixed
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              sorted={column === "name" ? direction : null}
              onClick={handleSort("name")}
            >
              Name
            </Table.HeaderCell>
            <Table.HeaderCell
              textAlign="center"
              sorted={column === "type" ? direction : null}
              onClick={handleSort("type")}
            >
              Type
            </Table.HeaderCell>
            <Table.HeaderCell
              textAlign="center"
              sorted={column === "voteTotal" ? direction : null}
              onClick={handleSort("voteTotal")}
            >
              Votes
            </Table.HeaderCell>
            <Table.HeaderCell
              textAlign="center"
              sorted={column === "created_at" ? direction : null}
              onClick={handleSort("created_at")}
            >
              Date Added
            </Table.HeaderCell>
            <Table.HeaderCell> </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.map((resource) => {
            return (
              <Table.Row
                key={resource._id}
                style={{ marginTop: "10px" }}
                verticalAlign="middle"
              >
                <Table.Cell
                  width={
                    resource._user == auth?._id || auth?.role == "admin" ? 5 : 6
                  }
                >
                  <Link
                    to={{
                      pathname: `/units/${match(resource)}/${resource._id}`,
                      state: {
                        unitResources: data,
                      },
                    }}
                  >
                    {resource.name}
                  </Link>
                </Table.Cell>
                <Table.Cell width={1} textAlign="center">
                  {resource.type}
                </Table.Cell>
                <Table.Cell width={1} textAlign="center">
                  {resource.voteTotal}
                </Table.Cell>
                <Table.Cell width={1} textAlign="center">
                  {new Date(resource.created_at).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell width={1} textAlign="center">
                  {resource._user == auth?._id || auth?.role == "admin" ? (
                    <Icon
                      name="delete"
                      className="custom_icon"
                      onClick={() => show(resource._id)}
                    />
                  ) : null}
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
        <Confirm
          open={open}
          size="tiny"
          cancelButton="Cancel"
          confirmButton="Delete Resource"
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      </Table>
    </Grid.Column>
  );
};

export default MobileView;
