import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { get } from "lodash";
import { Modal } from "react-bootstrap";

import Button from "../Button";
import { closeInfoOverlayDialog } from "../../actions/appActions";

const InfoOverlayDialog = ({
  handleSubmit,
  data,
  texts,
  closeInfoOverlayDialog,
  open,
  infoOverlayDialog,
  submitLabel,
  language,
  ...rest
}) => (
  <Modal
    {...{
      show: open,
      onHide: () => closeInfoOverlayDialog(),
      bsSize: "large",
      backdrop: "static",
      animation: false,
      ...rest
    }}
  >
    <Modal.Header closeButton>
      <Modal.Title>{get(data, "title", "")}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {get(data, "content", <p>{get(data, "text", "")}</p>)}
    </Modal.Body>
    <Modal.Footer>
      <Button
        {...{
          primary: true,
          className: "margin-left-small",
          onClick: () => closeInfoOverlayDialog()
        }}
      >
        {submitLabel || texts.CLOSE}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default compose(
  connect(null, {
    closeInfoOverlayDialog
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      const { closeInfoOverlayDialog } = this.props;

      if (get(nextProps, "data.autoClose")) {
        setTimeout(() => {
          closeInfoOverlayDialog();
        }, 5000);
      }
    }
  })
)(InfoOverlayDialog);
