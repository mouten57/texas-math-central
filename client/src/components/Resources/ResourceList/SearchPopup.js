import React from "react";
import { Form, Popup, Icon, Button, Input, Dropdown } from "semantic-ui-react";
import gradeLevels from "../data/gradeLevels";

const SearchPopup = (props) => {
  const {
    handlePopup,
    clearSearch,
    onChange,
    val,
    val_as_text,
    popupOpen,
    popup_open_as_text,
    options,
  } = props;

  return (
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
        open={popupOpen}
        position="bottom left"
        onOpen={() => handlePopup(popup_open_as_text, "open")}
        onClose={() => handlePopup(popup_open_as_text, "close")}
        trigger={
          <span
            style={{
              minHeight: "1.5em",
              maxHeight: "1.5em",
              overflow: "hidden",
              width: "100%",
            }}
          >
            {typeof val == "object" ? val.join(", ") : val}
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
            onSubmit={() => handlePopup(popup_open_as_text, "close")}
          >
            {val_as_text == "gradeSearchVal" ||
            val_as_text == "typeSearchVal" ? (
              <Dropdown
                name={val_as_text}
                value={val}
                fluid
                multiple
                selection
                options={options}
                placeholder="Choose one/multiple"
                onChange={onChange}
              />
            ) : (
              <Input
                compact="true"
                autoFocus
                style={{
                  appearance: "none",
                  width: "73%",
                }}
                name={val_as_text}
                value={val}
                onChange={onChange}
              />
            )}

            <Button
              compact="true"
              color="green"
              size="tiny"
              basic
              type="submit"
              style={{
                alignSelf: "center",
                height: "100%",
                marginLeft: "10px",
              }}
            >
              Ok
            </Button>
          </Form>
        }
        on={["click"]}
      />

      {val.length > 0 ? (
        <Icon
          className="custom_icon"
          name="delete"
          size="small"
          style={{ float: "right" }}
          onClick={() =>
            setTimeout(() => {
              clearSearch(val_as_text);
            }, 0)
          }
        />
      ) : null}
    </div>
  );
};
export default SearchPopup;
