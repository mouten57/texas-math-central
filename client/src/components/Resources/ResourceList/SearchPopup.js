import React from "react";
import { Form, Popup, Icon, Button, Input } from "semantic-ui-react";

const SearchPopup = (props) => {
  const {
    handlePopup,
    clearSearch,
    onChange,
    val,
    val_as_text,
    popupOpen,
    popup_open_as_text,
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
        position="bottom right"
        onOpen={() => handlePopup(popup_open_as_text, "open")}
        trigger={
          <span style={{ minHeight: "1.5em", width: "100%" }}>{val}</span>
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
                width: "20%",
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
