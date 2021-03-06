import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';

import DialogContainer from './DialogContainer';
import ErrorBlock from '../ErrorBlock';
import { deleteQuery, getSavedQueries } from '../../actions/queryActions';

const SearchQueryDelete = ({ handleSubmit, fail, setFail, texts }) => (
  <DialogContainer
    {...{
      title: texts.SEARCH_QUERY_DELETE,
      name: 'SearchQueryDelete',
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null),
    }}
  >
    <p>{texts.SEARCH_QUERY_DELETE_TEXT}</p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState('fail', 'setFail', null),
  connect(null, {
    deleteQuery,
    getSavedQueries,
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      deleteQuery,
      getSavedQueries,
      data: { id },
      setFail,
      texts,
    }) => async () => {
      if (await deleteQuery(id)) {
        setFail(null);
        closeDialog();

        await getSavedQueries();
      } else {
        setFail(texts.DELETE_FAILED);
      }
    },
  }),
  reduxForm({
    form: 'SearchQueryDeleteDialogForm',
  })
)(SearchQueryDelete);
