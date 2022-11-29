import React from 'react';
import { BrowserRouter as Router, Redirect, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { map } from 'lodash';

import Authentication from './containers/Authentication';
import Profile from './containers/profile/Profile';
import ProducerProfilesContainer from './containers/producerProfiles/ProducerProfilesContainer';
import Ingest from './containers/ingest/Ingest';
import IngestRoutinesContainer from './containers/ingestRoutines/IngestRoutinesContainer';
import IngestBatchesContainer from './containers/ingestBatches/IngestBatchesContainer';
import ValidationProfilesContainer from './containers/validationProfiles/ValidationProfilesContainer';
import SipProfilesContainer from './containers/sipProfiles/SipProfilesContainer';
import WorkflowDefinitionsContainer from './containers/workflowDefinitions/WorkflowDefinitionsContainer';
import DeletionRequests from './containers/deletionRequests/DeletionRequests';
import SearchQueries from './containers/searchQuery/SearchQueries';
import IndexSearch from './containers/indexSearch/IndexSearch';
import ExportTemplatesContainer from './containers/exportTemplates/ExportTemplatesContainer';
import UsersContainer from './containers/users/UsersContainer';
import RolesContainer from './containers/roles/RolesContainer';
import ProducersContainer from './containers/producers/ProducersContainer';
import ArchivalStorageAdministration from './containers/archivalStorageAdministration/ArchivalStorageAdministration';
import StorageAdministration from './containers/storageAdministration/StorageAdministration';
import Index from './containers/index/Index';
import IssueDictionaryContainer from './containers/issueDictionary/IssueDictionaryContainer';
import FormatsContainer from './containers/formats/FormatsContainer';
import RisksContainer from './containers/risks/RisksContainer';
import ToolsContainer from './containers/tools/ToolsContainer';
import NotificationsContainer from './containers/notifications/NotificationsContainer';
import ReportsContainer from './containers/reports/ReportsContainer';

import Aip from './containers/aip/Aip';
import AipEditor from './containers/aip/AipEditor';
import IngestWorkflow from './containers/ingestWorkflow/IngestWorkflow';
import ErrorPage from './containers/ErrorPage';
import NoRole from './containers/NoRole';

import Dialogs from './containers/Dialogs';

import Route from './components/routing/Route';

import { getUser, keepAlive } from './actions/userActions';
import { filterByPermission, getHomepage, hasPermissions } from './utils';
import { Permission } from './enums';


const App = ({ store, user, language, texts }) => {

  // Every (new) page component will have these props by default + route props
  const containerProps = {
    user,
    language,
    texts,
  };

  return (
    <Provider {...{ store }}>
      <Router>
        <div>
          <Dialogs {...containerProps} />
          <Switch>
            {map(
              filterByPermission([
                {
                  path: '/',
                  Component: Authentication,
                  exact: true,
                },
                {
                  path: '/profile',
                  Component: Profile,
                  exact: true,
                },
                {
                  path: '/producer-profiles',
                  Component: ProducerProfilesContainer,
                  permission: Permission.PRODUCER_PROFILE_RECORDS_READ,
                },
                {
                  path: '/ingest',
                  Component: Ingest,
                  permission: Permission.BATCH_PROCESSING_WRITE,
                },
                {
                  path: '/ingest-routines',
                  Component: IngestRoutinesContainer,
                  permission: Permission.INGEST_ROUTINE_RECORDS_READ,
                },
                {
                  path: '/ingest-batches',
                  Component: IngestBatchesContainer,
                  permission: Permission.BATCH_PROCESSING_READ,
                },
                {
                  path: '/validation-profiles',
                  Component: ValidationProfilesContainer,
                  permission: Permission.VALIDATION_PROFILE_RECORDS_READ,
                },
                {
                  path: '/sip-profiles',
                  Component: SipProfilesContainer,
                  permission: Permission.SIP_PROFILE_RECORDS_READ,
                },
                {
                  path: '/workflow-definitions',
                  Component: WorkflowDefinitionsContainer,
                  permission: Permission.WORKFLOW_DEFINITION_RECORDS_READ,
                },
                {
                  path: '/deletion-requests',
                  Component: DeletionRequests,
                  permission: Permission.DELETION_REQUESTS_READ,
                },
                {
                  path: '/search-queries',
                  Component: SearchQueries,
                  permission: Permission.AIP_QUERY_RECORDS_READ,
                },
                {
                  path: '/aip-search',
                  Component: IndexSearch,
                  permission: Permission.AIP_RECORDS_READ,
                },
                {
                  path: '/export-templates',
                  Component: ExportTemplatesContainer,
                  permission: Permission.EXPORT_TEMPLATES_READ,
                },
                {
                  path: '/users',
                  Component: UsersContainer,
                  permission: Permission.USER_RECORDS_READ,
                },
                {
                  path: '/roles',
                  Component: RolesContainer,
                  permission: Permission.USER_ROLE_RECORDS_READ,
                },
                {
                  path: '/producers',
                  Component: ProducersContainer,
                  permission: Permission.PRODUCER_RECORDS_READ,
                },
                {
                  path: '/archival-storage-administration',
                  Component: ArchivalStorageAdministration,
                  permission: Permission.SUPER_ADMIN_PRIVILEGE,
                },
                {
                  path: '/logical-storage-administration',
                  Component: StorageAdministration,
                  permission: Permission.STORAGE_ADMINISTRATION_READ,
                },
                {
                  path: '/index',
                  Component: Index,
                  permission: Permission.REINDEX_ELIGIBILITY,
                },
                {
                  path: '/issue-dictionary',
                  Component: IssueDictionaryContainer,
                  permission: Permission.ISSUE_DEFINITIONS_READ,
                },
                {
                  path: '/formats',
                  Component: FormatsContainer,
                  permission: Permission.FORMAT_RECORDS_READ,
                },
                {
                  path: '/risks',
                  Component: RisksContainer,
                  permission: Permission.RISK_RECORDS_READ,
                },
                {
                  path: '/tools',
                  Component: ToolsContainer,
                  permission: Permission.TOOL_RECORDS_READ,
                },
                {
                  path: '/notifications',
                  Component: NotificationsContainer,
                  permission: Permission.NOTIFICATION_RECORDS_READ,
                },
                {
                  path: '/reports',
                  Component: ReportsContainer,
                  permission: Permission.REPORT_TEMPLATE_RECORDS_READ,
                },

                {
                  path: '/aip/:id',
                  Component: Aip,
                  permission: Permission.AIP_RECORDS_READ,
                },
                {
                  path: '/aip/edit/:id',
                  Component: AipEditor,
                  permission: Permission.AIP_RECORDS_READ,
                },
                {
                  path: '/ingest-workflows/:id',
                  Component: IngestWorkflow,
                  permission: Permission.BATCH_PROCESSING_READ,
                },
                {
                  path: '/error',
                  Component: ErrorPage,
                },
                {
                  path: '/no-role',
                  Component: NoRole,
                },
              ]),
              ({ Component, path, permission, ...item }, key) => {
                return (
                  <Route
                    {...{
                      ...item,
                      key,
                      path,
                      render: (props) => <Component {...{ ...containerProps, ...props }} />,
                    }}
                  />
                );
              }
            )}
            <Redirect to={getHomepage()} />
          </Switch>
        </div>
      </Router>
    </Provider>
  );
};

export default compose(
  connect(({ app: { user, texts, language } }) => ({ user, texts, language }), {
    getUser,
    keepAlive,
  }),
  lifecycle({
    componentWillMount() {
      const { getUser, keepAlive } = this.props;

      window.interval = setInterval(keepAlive, 270000);

      if (
        hasPermissions() &&
        window.location.pathname !== '/error' &&
        window.location.pathname !== '/no-role'
      ) {
        getUser();
      }
    },
    componentWillUnmount() {
      clearInterval(window.interval);
    },
  })
)(App);
