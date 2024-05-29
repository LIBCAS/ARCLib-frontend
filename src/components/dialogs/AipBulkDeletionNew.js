import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { reduxForm, Field, reset } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { isEmpty, map } from 'lodash';

import DialogContainer from './DialogContainer';
import { Checkbox, TextField, Validation } from '../form';
import Button from '../Button';
import{createAipBulkDeletion, getAipBulkDeletions} from '../../actions/aipBulkDeletionActions';

const AipBulkDeletionNew = ({ handleSubmit, texts, language, setDialog, change }) => (
  <DialogContainer
    {...{
      title: texts.AIP_BULK_DELETION_NEW,
      name: 'AipBulkDeletionNew',
      handleSubmit,
      submitLabel: texts.SUBMIT,
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      {map(
        [
          {
            component: Checkbox,
            label: texts.DELETE_IF_NEWER_VERSIONS_DELETED,
            name: 'deleteIfNewerVersionsDeleted',
          },
          {
            component: TextField,
            label: texts.AIP_IDS,
            name: 'aipIds',
            validate: [Validation.required[language]],
            type: 'textarea',
            buttons: [
              {
                label: texts.UPLOAD_LIST_OF_IDENTIFIERS,
                onClick: () =>
                  setDialog('DropFilesDialog', {
                    title: texts.UPLOAD_LIST_OF_IDENTIFIERS,
                    label: texts.DROP_FILE_OR_CLICK_TO_SELECT_FILE,
                    multiple: false,
                    onDrop: (files) => {
                      const file = files[0];

                      if (file) {
                        const reader = new FileReader();

                        reader.readAsText(file);

                        reader.onloadend = () => {
                          const ids = reader.result;

                          change('aipIds', ids);
                        };
                      }
                    },
                    afterClose: () => setDialog('AipBulkDeletionNew'),
                  }),
              },
            ],
          },
        ],
        ({ buttons, name, ...field }, key) => (
          <div {...{ key }}>
            <Field {...{ id: `aip-bulk-deletion-new-${name}`, name, ...field }} />
            {!isEmpty(buttons) && (
              <div {...{ className: 'flex-row flex-right' }}>
                {map(buttons, ({ label, ...props }, key) => (
                  <Button {...{ key, ...props }}>{label}</Button>
                ))}
              </div>
            )}
          </div>
        )
      )}
            { <p>{texts.AIP_BULK_DELETION_NEW_NOTE}</p> }
    </form>
  </DialogContainer>
);

export default compose(
  connect(null, {
    createAipBulkDeletion,
    getAipBulkDeletions,
    reset,
  }),
  withRouter,

  withHandlers({
    onSubmit: ({
      closeDialog,
      createAipBulkDeletion,
      getAipBulkDeletions,
      reset,
    }) => async ({ producerProfile, ...formData }) => {
      const success = await createAipBulkDeletion(formData);
      if (success) {
        getAipBulkDeletions();
        reset('AipBulkDeletionNewDialogForm');
        closeDialog();
      }
    },
  }),


  reduxForm({
    form: 'AipBulkDeletionNewDialogForm',
    enableReinitialize: true,
  })
)(AipBulkDeletionNew);
