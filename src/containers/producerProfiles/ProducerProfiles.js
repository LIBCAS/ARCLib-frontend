import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import Button from '../../components/Button';
import PageWrapper from '../../components/PageWrapper';
import Table from '../../components/producerProfiles/Table';
import Pagination from '../../components/Pagination';
import { setDialog, setPager } from '../../actions/appActions';
import { getProducers } from '../../actions/producerActions';
import { getProducerProfiles } from '../../actions/producerProfileActions';
import { getSipProfiles } from '../../actions/sipProfileActions';
import { getValidationProfiles } from '../../actions/validationProfileActions';
import { getWorkflowDefinitions } from '../../actions/workflowDefinitionActions';
import { hasPermission } from '../../utils';
import { Permission } from '../../enums';

const ProducerProfiles = ({
  history,
  getProducers,
  getProducerProfiles,
  producerProfiles,
  setDialog,
  getSipProfiles,
  getValidationProfiles,
  getWorkflowDefinitions,
  texts,
  user,
  pager,
  setPager,
}) => {
  const handleUpdate = () => {
    getProducerProfiles();
  };
  const onFilterUpdate = () => {
    setPager({ ...pager, page: 0 });
    setTimeout(handleUpdate());
  };

  return (
    <PageWrapper {...{ breadcrumb: [{ label: texts.PRODUCER_PROFILES }] }}>
      {hasPermission(Permission.PRODUCER_PROFILE_RECORDS_WRITE) && (
        <Button
          {...{
            primary: true,
            className: 'margin-bottom-small',
            onClick: () => {
              if (hasPermission(Permission.SUPER_ADMIN_PRIVILEGE)) {
                getProducers();
              }
              getSipProfiles();
              getValidationProfiles();
              getWorkflowDefinitions();
              setDialog('ProducerProfileNew');
            },
          }}
        >
          {texts.NEW}
        </Button>
      )}
      <Table
        {...{
          history,
          texts,
          user,
          producerProfiles: get(producerProfiles, 'items'),
          handleUpdate: onFilterUpdate,
        }}
      />
      <Pagination
        {...{
          handleUpdate,
          count: get(producerProfiles, 'items.length', 0),
          countAll: get(producerProfiles, 'count', 0),
        }}
      />
    </PageWrapper>
  );
};

export default compose(
  withRouter,
  connect(
    ({ app: { pager }, producerProfile: { producerProfiles } }) => ({
      pager,
      producerProfiles,
    }),
    {
      getProducers,
      getProducerProfiles,
      setDialog,
      getSipProfiles,
      getValidationProfiles,
      getWorkflowDefinitions,
      setPager,
    }
  ),
  lifecycle({
    componentDidMount() {
      const { getProducerProfiles } = this.props;

      getProducerProfiles();
    },
  })
)(ProducerProfiles);
