import React from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-bootstrap';

import Button from '../Button';
import { closeDialog } from '../../actions/appActions';

const DialogContainer = ({
  dialog,
  name,
  title,
  children,
  closeDialog,
  handleSubmit,
  submitLabel,
  noCloseButton,
  onClose,
  texts,
  large,
  ...rest
}) => (
  <Modal
    {...{
      show: dialog.name === name,
      onHide: () => {
        closeDialog();
        if (onClose) {
          onClose();
        }
      },
      bsSize: large && 'large',
      backdrop: 'static',
      animation: false,
      ...rest,
    }}
  >
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{children}</Modal.Body>
    <Modal.Footer>
      {!noCloseButton && (
        <Button
          {...{
            onClick: () => {
              closeDialog();
              if (onClose) {
                onClose();
              }
            },
          }}
        >
          {texts.STORNO}
        </Button>
      )}
      <Button
        {...{
          primary: true,
          className: 'margin-left-small',
          onClick: () => handleSubmit(),
        }}
      >
        {submitLabel}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default connect(({ app: { dialog, texts } }) => ({ dialog, texts }), {
  closeDialog,
})(DialogContainer);
