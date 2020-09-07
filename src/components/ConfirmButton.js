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
import ErrorBlock from "./ErrorBlock";

const ConfirmButton = ({
  label,
  title,
  text,
  open,
  setOpen,
  onSubmit,
  texts,
  fail,
  setFail,
  onClose,
  key,
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
        {text}
        <ErrorBlock {...{ label: fail }} />
      </Modal.Body>
      <Modal.Footer>
        <Button
          {...{
            onClick: onClose
          }}
        >
          {texts.STORNO}
        </Button>
        <Button
          {...{
            primary: true,
            className: "margin-left-small",
            onClick: () => onSubmit()
          }}
        >
          {texts.SUBMIT}
        </Button>
      </Modal.Footer>
    </Modal>
    <Button {...{ onClick: () => setOpen(true), ...props }}>{label}</Button>
  </div>
);

export default compose(
  defaultProps({ onClick: () => true }),
  connect(({ app: { texts } }) => ({ texts })),
  withState("open", "setOpen", false),
  withState("fail", "setFail", null),
  withHandlers({
    onSubmit: ({ onClick, setFail, failText, setOpen }) => async () => {
      if (await onClick()) {
        setFail(null);
        setOpen(false);
      } else {
        setFail(failText);
        if (!failText) {
          setOpen(false);
        }
      }
    },
    onClose: ({ setOpen, setFail }) => () => {
      setOpen(false);
      setFail(null);
    }
  }),
  mapProps(({ onClick, dispatch, ...rest }) => rest)
)(ConfirmButton);
