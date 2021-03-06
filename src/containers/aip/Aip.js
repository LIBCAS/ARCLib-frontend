import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import PageWrapper from '../../components/PageWrapper';
import Detail from '../../components/aip/Detail';
import { clearAip, getAip } from '../../actions/aipActions';
import { setDialog } from '../../actions/appActions';
import { getStoragesBasic } from '../../actions/storageActions';

const Aip = ({ aip, texts, history, storages, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        { label: texts.AIP_SEARCH, url: '/aip-search' },
        { label: get(aip, 'ingestWorkflow.externalId', texts.AIP) },
      ],
    }}
  >
    {aip && <Detail {...{ aip, texts, history, storages, ...props }} />}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ aip: { aip }, storage: { storages } }) => ({ aip, storages }), {
    clearAip,
    getAip,
    setDialog,
    getStoragesBasic,
  }),
  lifecycle({
    componentWillMount() {
      const { match, clearAip, getAip, getStoragesBasic } = this.props;

      clearAip();
      getAip(match.params.id);
      getStoragesBasic();
    },
  })
)(Aip);
