import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { reduxForm, Field } from 'redux-form';
import { withRouter } from 'react-router-dom';

import DialogContainer from './DialogContainer';
import { TextField } from '../form';
import ButtonComponent from '../Button';

import { setDialog, closeDialog } from '../../actions/appActions';
import { deleteExportRoutine } from '../../actions/exportRoutineActions';
import { formatDateTime } from '../../utils';


const SearchQueryExportResults2 = (props) => {

  return (
    <DialogContainer
      title={props.texts.EXPORT_SEARCH_RESULTS}
      name='SearchQueryExportResults2'
      submitLabel={props.texts.SUBMIT}
      handleSubmit={props.handleSubmit}
    >
      <form onSubmit={props.handleSubmit}>
        <Field
          name='name'
          component={TextField}
          type='text'
          label={props.texts.QUERY_NAME}
          disabled={true}
        />

        <Field
          name='edited'
          component={TextField}
          type='text'
          label={props.texts.EDITED}
          disabled={true}
        />

        <ButtonComponent
          onClick={() => {
            props.setDialog('SearchQueryExportConfigNewUpd', {
              action: 'new',
              aipQuery: props.aipQuery,
            })
          }}
        >
          {props.texts.NEW_EXPORT}
        </ButtonComponent>

        <h1 className='h1-dialog'>
          {props.texts.EXPORT_ROUTINE}
        </h1>

        <hr className='hr-dialog'/>

        <div className='margin-bottom-small'>
        <ButtonComponent
          style={{marginRight: '1em'}}
          disabled={props.aipQuery && props.aipQuery.exportRoutine ? false : true}
          onClick={async () => {
            await props.deleteExportRoutine(props.aipQuery.exportRoutine.id);
            props.closeDialog();
          }}
        >
          {props.texts.DELETE}
        </ButtonComponent>

        <ButtonComponent
          disabled={props.aipQuery && props.aipQuery.exportRoutine ? false : true}
          onClick={() => {
            props.setDialog('SearchQueryExportConfigNewUpd', {
              action: 'update',
              aipQuery: props.aipQuery,
            })
          }}
        >
          {props.texts.EDIT}
        </ButtonComponent>
        </div>

        <Field
          name='exportTime'
          component={TextField}
          type='text'
          label={props.texts.EXPORT_ROUTINE_TIME}
          disabled={true}
        />

        <Field
          name='exportLocationPath'
          component={TextField}
          type='text'
          label={props.texts.EXPORT_ROUTINE_LOCATION}
          disabled={true}
        />

      </form>
    </DialogContainer>
  );
}


const mapStateToProps = (store) => {
  // One actual query for this dialog (sent from dialog)
  const aipQuery = store.app.dialog.data ? store.app.dialog.data.aipQuery : null;

  return {
    aipQuery: aipQuery,
    initialValues: {
      name: aipQuery ? aipQuery.name : '',
      edited: aipQuery ? formatDateTime(aipQuery.updated) : '',
      exportTime: aipQuery && aipQuery.exportRoutine && aipQuery.exportRoutine.exportTime ? formatDateTime(aipQuery.exportRoutine.exportTime) : '',
      exportLocationPath: aipQuery && aipQuery.exportRoutine && aipQuery.exportRoutine.config && aipQuery.exportRoutine.config.exportFolder ? aipQuery.exportRoutine.config.exportFolder : '',
    }
  }
}

const mapDispatchToProps = (dispatch) => ({
  setDialog: (name, data) => dispatch(setDialog(name, data)),
  closeDialog: () => dispatch(closeDialog()),
  deleteExportRoutine: (id) => dispatch(deleteExportRoutine(id)),
})

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  // OnSubmit should not be required here!
  // TODO: Remove the Submit button for this dialog
  withHandlers({
    onSubmit: (props) => async (formData) => {
      await props.closeDialog();
    }
  }),
  reduxForm({
    form: 'SearchQueryExportResultsDialogForm2',
    enableReinitialize: true,
  }),
)(SearchQueryExportResults2);