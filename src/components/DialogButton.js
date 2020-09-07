import React from "react";
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

const DialogButton = ({
  label,
  title,
  content: Content,
  open,
  setOpen,
  onSubmit,
  texts,
  fail,
  setFail,
  onClose,
  key,
  closeButton,
  submitButton,
  closeButtonLabel,
  submitButtonLabel,
  ...props
}) => (
  <div {...{ key }}>
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
        {<Content {...{ closeDialog: () => setOpen(false) }} />}
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
    <Button {...{ onClick: () => setOpen(true), ...props }}>{label}</Button>
  </div>
);

export default compose(
  defaultProps({
    onClick: () => true,
    closeButton: true,
    submitButton: true,
    content: () => <div />
  }),
  connect(({ app: { texts } }) => ({ texts })),
  withState("open", "setOpen", false),
  withHandlers({
    onSubmit: ({ onClick, setOpen }) => async () => {
      if (await onClick()) {
        setOpen(false);
      }
    },
    onClose: ({ setOpen }) => () => {
      setOpen(false);
    }
  }),
  mapProps(({ onClick, dispatch, ...rest }) => rest)
)(DialogButton);
