import React from "react";
import { find } from "lodash";
import { connect } from "react-redux";
import {
  compose,
  withState,
  withHandlers,
  defaultProps,
  mapProps
} from "recompose";
import { Modal } from "react-bootstrap";

import Button from "./Button";
import DropDown from "./DropDown";

const DialogDropDown = ({
  open,
  setOpen,
  item: { title, content: Content },
  setItem,
  onSubmit,
  texts,
  onClose,
  closeButton,
  submitButton,
  closeButtonLabel,
  submitButtonLabel,
  items,
  ...props
}) => (
  <div>
    <Modal
      {...{
        show: open,
        onHide: onClose,
        backdrop: "static",
        animation: false
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {Content && (
          <Content
            {...{
              closeDialog: () => {
                setOpen(false);
                setItem({});
              }
            }}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        {closeButton && (
          <Button
            {...{
              onClick: onClose
            }}
          >
            {closeButtonLabel || texts.STORNO}
          </Button>
        )}
        {submitButton && (
          <Button
            {...{
              primary: true,
              className: "margin-left-small",
              onClick: () => onSubmit()
            }}
          >
            {submitButtonLabel || texts.SUBMIT}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
    <DropDown
      {...{
        onClick: key => {
          const newItem = find(items, ({ value }) => value === key);
          setItem(newItem ? newItem : {});
          setOpen(true);
        },
        items,
        ...props
      }}
    />
  </div>
);

export default compose(
  defaultProps({
    items: [],
    closeButton: true,
    submitButton: true
  }),
  connect(({ app: { texts } }) => ({ texts })),
  withState("open", "setOpen", false),
  withState("item", "setItem", {}),
  withHandlers({
    onSubmit: ({ item: { onClick }, setOpen }) => async () => {
      if (!onClick || (await onClick())) {
        setOpen(false);
      }
    },
    onClose: ({ setOpen }) => () => {
      setOpen(false);
    }
  }),
  mapProps(({ onClick, dispatch, ...rest }) => rest)
)(DialogDropDown);
