import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import DialogContainer from './DialogContainer';
import ErrorBlock from '../ErrorBlock';
import { deleteReport, getReports } from '../../actions/reportActions';

const ReportDelete = ({ handleSubmit, data, fail, setFail, texts }) => (
  <DialogContainer
    {...{
      title: texts.REPORT_DELETE,
      name: 'ReportDelete',
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null),
    }}
  >
    <p>
      {texts.REPORT_DELETE_TEXT}
      {get(data, 'name') ? <strong> {get(data, 'name')}</strong> : ''}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState('fail', 'setFail', null),
  connect(null, {
    deleteReport,
    getReports,
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      deleteReport,
      getReports,
      data: { id },
      setFail,
      texts,
    }) => async () => {
      if (await deleteReport(id)) {
        getReports();
        setFail(null);
        closeDialog();
      } else {
        setFail(texts.DELETE_FAILED);
      }
    },
  }),
  reduxForm({
    form: 'ReportDeleteDialogForm',
  })
)(ReportDelete);
