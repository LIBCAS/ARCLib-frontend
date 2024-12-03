import React from 'react';
import { compose, withHandlers } from 'recompose';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import DialogContainer from './DialogContainer';
import Table from '../indexSearch/Table';

const SearchQueryDetail = ({ handleSubmit, data, history, texts }) => (
  <DialogContainer
    {...{
      title: texts.SEARCH_QUERY_RESULTS,
      name: 'SearchQueryDetail',
      handleSubmit,
      submitLabel: texts.CLOSE,
      noCloseButton: true,
      large: true,
    }}
  >
    <Table
      {...{
        data,
        history,
        items: get(data, 'items'),
        texts,
        displayCheckboxes: false,
        isTableInDialog: true,
        tableDialogId: get(data, 'tableDialogId'),
      }}
    />
  </DialogContainer>
);

export default compose(
  withRouter,
  withHandlers({
    onSubmit:
      ({ closeDialog }) =>
      async () => {
        closeDialog();
      },
  }),
  reduxForm({
    form: 'SearchQueryDetailDialogForm',
  })
)(SearchQueryDetail);
