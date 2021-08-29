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
import SearchPopup from "../SearchPopup";
import gradeLevels from "../../data/gradeLevels";
import resourceTypes from "../../data/resourceTypes";

const TabletOrHigherView = (props) => {
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
    handlePopup,
    namePopupOpen,
    nameSearchVal,
    typePopupOpen,
    typeSearchVal,
    onChange,
    clearSearch,
    gradeSearchVal,
    gradePopupOpen,
  } = props;
  return (
    <Grid.Column as={Media} greaterThanOrEqual="tablet">
      <Table
        style={{
          display: "block",
          marginBottom: "10px",
          maxHeight: "70vh",
          overflow: "auto",
        }}
        unstackable
        // sortable
        fixed
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
              <SearchPopup
                handlePopup={handlePopup}
                clearSearch={clearSearch}
                onChange={onChange}
                val={nameSearchVal}
                val_as_text="nameSearchVal"
                popupOpen={namePopupOpen}
                popup_open_as_text="namePopupOpen"
              />
            </Table.HeaderCell>
            <Table.HeaderCell
              // textAlign="center"
              sorted={column === "grade" ? direction : null}
            >
              <IconForResourceList
                selected={column == "grade"}
                direction={direction}
              />
              <p
                className="headerLabel"
                onClick={handleSort("grade")}
                style={{ padding: 0, margin: 0 }}
              >
                Grade Level
              </p>
              <SearchPopup
                handlePopup={handlePopup}
                clearSearch={clearSearch}
                onChange={onChange}
                val={gradeSearchVal}
                val_as_text="gradeSearchVal"
                options={gradeLevels}
                popupOpen={gradePopupOpen}
                popup_open_as_text="gradePopupOpen"
              />
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
              <SearchPopup
                handlePopup={handlePopup}
                clearSearch={clearSearch}
                onChange={onChange}
                val={typeSearchVal}
                options={resourceTypes}
                val_as_text="typeSearchVal"
                popupOpen={typePopupOpen}
                popup_open_as_text="typePopupOpen"
              />
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
                    resource._user == auth?._id || auth?.role == "admin" ? 4 : 5
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
                  {resource.grade}
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
