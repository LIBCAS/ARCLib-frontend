import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withState } from 'recompose';
import { withRouter, Route } from 'react-router-dom';
import { get } from 'lodash';

import PageWrapper from '../../components/PageWrapper';
import Detail from '../../components/ingestWorkflow/Detail';
import Event from './Event';
import { getWorkflow } from '../../actions/workflowActions';

const IngestWorkflow = ({ workflow, texts, match, location, ...props }) =>
  /^\/ingest-workflows\/[^/]+\/events\/.+/.test(location.pathname) ? (
    <Route
      {...{
        path: `${match.url}/events/:id`,
        render: () => <Event {...{ texts, workflow, ...props }} />,
      }}
    />
  ) : (
    <PageWrapper
      {...{
        breadcrumb: [
          {
            label: `${texts.INGEST_WORKFLOW}${
              get(workflow, 'ingestWorkflow.externalId')
                ? ` ${get(workflow, 'ingestWorkflow.externalId')}`
                : ''
            }`,
          },
        ],
      }}
    >
      {workflow && <Detail {...{ workflow, texts, ...props }} />}
    </PageWrapper>
  );

export default compose(
  withRouter,
  connect(({ workflow: { workflow } }) => ({ workflow }), {
    getWorkflow,
  }),
  withState('timeoutId', 'setTimeoutId', null),
  lifecycle({
    async componentDidMount() {
      const { match, getWorkflow, setTimeoutId } = this.props;

      this.mounted = true;

      const id = match.params.id;

      const enableUrl = `/ingest-workflows/${id}`;

      const ok = await getWorkflow(id, true, true, enableUrl);

      const updateItem = async () => {
        const ok = await getWorkflow(id, false, false, enableUrl);
        if (ok && this.mounted) {
          setTimeoutId(setTimeout(updateItem, 10000));
        }
      };

      if (ok) {
        setTimeoutId(setTimeout(updateItem, 10000));
      }
    },
    componentWillUnmount() {
      const { timeoutId } = this.props;

      this.mounted = false;

      clearTimeout(timeoutId);
    },
  })
)(IngestWorkflow);
