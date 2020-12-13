import React from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { get, find } from 'lodash';

import PageWrapper from '../../components/PageWrapper';
import EventDetail from '../../components/ingestWorkflow/EventDetail';

const Event = ({ workflow, texts, match, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        {
          label: `${texts.INGEST_WORKFLOW}${
            get(workflow, 'ingestWorkflow.externalId')
              ? ` ${get(workflow, 'ingestWorkflow.externalId')}`
              : ''
          }`,
          url: `/ingest-workflows/${get(workflow, 'ingestWorkflow.externalId')}`,
        },
        {
          label: texts.EVENT,
        },
      ],
    }}
  >
    {workflow && (
      <EventDetail
        {...{
          workflow,
          texts,
          event: find(get(workflow, 'events'), (event) => get(event, 'id') === match.params.id),
          initialValues: find(
            get(workflow, 'events'),
            (event) => get(event, 'id') === match.params.id
          ),
          ...props,
        }}
      />
    )}
  </PageWrapper>
);

export default compose(withRouter)(Event);
