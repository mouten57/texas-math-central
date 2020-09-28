import React from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Table,
  Confirm,
  Icon,
  Button,
  Popup,
  Form,
  Input,
} from "semantic-ui-react";
import IconForResourceList from "../IconForResourceList";

const TabletOrHigherView = (props) => {
  const {
    Media,
    handleSort,
    match,
    data,
    resources,
    show,
    direction,
    column,
    open,
    auth,
    handleCancel,
    handleConfirm,
    handlePopup,
    namePopupOpen,
    nameSearchVal,
    typePopupOpen,
    typeSearchVal,
    onChange,
    clearSearch,
  } = props;
  return (
    <Grid.Column as={Media} greaterThanOrEqual="tablet">
      <Table
        style={{ marginBottom: "10px" }}
        unstackable
        // sortable
        striped
        compact
      >
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell sorted={column === "name" ? direction : null}>
              <IconForResourceList
                selected={column == "name"}
                direction={direction}
              />
              <p
                className="headerLabel"
                onClick={handleSort("name")}
                style={{ padding: 0, margin: 0 }}
              >
                Name
              </p>
              <div
                style={{
                  width: "100%",
                  minHeight: "1.5em",
                  borderBottom: "1px solid black",
                  display: "flex",
                  alignContent: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                <Popup
                  wide="very"
                  open={namePopupOpen}
                  position="bottom right"
                  onOpen={() => handlePopup("namePopupOpen", "open")}
                  trigger={
                    <span style={{ minHeight: "1.5em", width: "100%" }}>
                      {nameSearchVal}
                    </span>
                  }
                  content={
                    <Form
                      style={{
                        width: "100%",
                        minHeight: "1.5em",
                        display: "flex",
                        verticalAlign: "middle",
                      }}
                      onSubmit={() => handlePopup("namePopupOpen", "close")}
                    >
                      <Input
                        compact
                        autoFocus
                        style={{
                          appearance: "none",
                          width: "73%",
                        }}
                        name="nameSearchVal"
                        value={nameSearchVal}
                        onChange={onChange}
                      />

                      <Button
                        compact
                        color="green"
                        size="tiny"
                        basic
                        type="submit"
                        style={{
                          alignSelf: "center",
                          height: "100%",
                          marginLeft: "10px",
                          width: "20%",
                        }}
                      >
                        Ok
                      </Button>
                    </Form>
                  }
                  on={["click"]}
                />

                {nameSearchVal.length > 0 ? (
                  <Icon
                    className="custom_icon"
                    name="delete"
                    size="small"
                    style={{ float: "right" }}
                    onClick={() =>
                      setTimeout(() => {
                        clearSearch("nameSearchVal");
                      }, 0)
                    }
                  />
                ) : null}
              </div>
            </Table.HeaderCell>
            <Table.HeaderCell
              // textAlign="center"
              sorted={column === "type" ? direction : null}
            >
              <IconForResourceList
                selected={column == "type"}
                direction={direction}
              />
              <p
                className="headerLabel"
                onClick={handleSort("type")}
                style={{ padding: 0, margin: 0 }}
              >
                Type
              </p>
              <div
                style={{
                  width: "100%",
                  minHeight: "1.5em",
                  borderBottom: "1px solid black",
                  display: "flex",
                  alignContent: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                <Popup
                  wide="very"
                  open={typePopupOpen}
                  onOpen={() => handlePopup("typePopupOpen", "open")}
                  position="bottom right"
                  trigger={
                    <span style={{ minHeight: "1.5em", width: "100%" }}>
                      {typeSearchVal}
                    </span>
                  }
                  content={
                    <Form
                      style={{
                        width: "100%",
                        minHeight: "1.5em",
                        display: "flex",
                        verticalAlign: "middle",
                      }}
                      onSubmit={() => handlePopup("typePopupOpen", "close")}
                    >
                      <Input
                        compact
                        autoFocus
                        style={{
                          appearance: "none",
                          width: "73%",
                        }}
                        name="typeSearchVal"
                        value={typeSearchVal}
                        onChange={onChange}
                      />
                      <Button
                        compact
                        color="green"
                        size="tiny"
                        basic
                        type="submit"
                        style={{
                          alignSelf: "center",
                          height: "100%",
                          marginLeft: "10px",
                          width: "20%",
                        }}
                      >
                        Ok
                      </Button>
                    </Form>
                  }
                  on={["click"]}
                />

                {typeSearchVal.length > 0 ? (
                  <Icon
                    className="custom_icon"
                    name="delete"
                    size="small"
                    style={{ float: "right" }}
                    onClick={() =>
                      setTimeout(() => {
                        clearSearch("typeSearchVal");
                      }, 0)
                    }
                  />
                ) : null}
              </div>
            </Table.HeaderCell>
            <Table.HeaderCell
              textAlign="center"
              sorted={column === "voteTotal" ? direction : null}
            >
              <IconForResourceList
                selected={column == "voteTotal"}
                direction={direction}
              />
              <p
                className="headerLabel"
                onClick={handleSort("voteTotal")}
                style={{ padding: 0, margin: 0 }}
              >
                Votes
              </p>
              <div
                style={{
                  width: "100%",
                  minHeight: "1.5em",
                }}
              ></div>
            </Table.HeaderCell>
            <Table.HeaderCell
              textAlign="center"
              sorted={column === "created_at" ? direction : null}
            >
              <IconForResourceList
                selected={column == "created_at"}
                direction={direction}
              />
              <p
                className="headerLabel"
                onClick={handleSort("created_at")}
                style={{ padding: 0, margin: 0 }}
              >
                Date Added
              </p>
              <div
                style={{
                  width: "100%",
                  minHeight: "1.5em",
                }}
              ></div>
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
                        unitResources: resources,
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

export default TabletOrHigherView;
