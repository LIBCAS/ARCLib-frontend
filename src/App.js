import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { map, isEmpty, get } from "lodash";

import Dialogs from "./containers/Dialogs";
import Aip from "./containers/aip/Aip";
import AipEditor from "./containers/aip/AipEditor";
import ArchivalStorageAdministration from "./containers/archivalStorageAdministration/ArchivalStorageAdministration";
import Authentication from "./containers/Authentication";
import Profile from "./containers/profile/Profile";
import DeletionRequests from "./containers/deletionRequests/DeletionRequests";
import ErrorPage from "./containers/ErrorPage";
import IndexSearch from "./containers/indexSearch/IndexSearch";
import Ingest from "./containers/ingest/Ingest";
import IngestBatchesContainer from "./containers/ingestBatches/IngestBatchesContainer";
import IngestRoutinesContainer from "./containers/ingestRoutines/IngestRoutinesContainer";
import IngestWorkflow from "./containers/ingestWorkflow/IngestWorkflow";
import IssueDictionaryContainer from "./containers/issueDictionary/IssueDictionaryContainer";
import NotificationsContainer from "./containers/notifications/NotificationsContainer";
import NoRole from "./containers/NoRole";
import FormatsContainer from "./containers/formats/FormatsContainer";
import RisksContainer from "./containers/risks/RisksContainer";
import ProducerProfilesContainer from "./containers/producerProfiles/ProducerProfilesContainer";
import ProducersContainer from "./containers/producers/ProducersContainer";
import SearchQueries from "./containers/searchQuery/SearchQueries";
import SipProfilesContainer from "./containers/sipProfiles/SipProfilesContainer";
import StorageAdministration from "./containers/storageAdministration/StorageAdministration";
import ToolsContainer from "./containers/tools/ToolsContainer";
import UsersContainer from "./containers/users/UsersContainer";
import RolesContainer from "./containers/roles/RolesContainer";
import ValidationProfilesContainer from "./containers/validationProfiles/ValidationProfilesContainer";
import WorkflowDefinitionsContainer from "./containers/workflowDefinitions/WorkflowDefinitionsContainer";
import ReportsContainer from "./containers/reports/ReportsContainer";
import Route from "./components/routing/Route";
import { getUser, keepAlive } from "./actions/userActions";
import { filterByPermission, hasPermissions } from "./utils";
import { Permission } from "./enums";

const App = ({ store, user, language, texts }) => {
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
                  path: "/",
                  Component: Authentication,
                  exact: true,
                },
                {
                  path: "/profile",
                  Component: Profile,
                  exact: true,
                },
                {
                  path: "/aip/edit/:id",
                  Component: AipEditor,
                  permission: Permission.AIP_RECORDS_READ,
                },
                {
                  path: "/aip/:id",
                  Component: Aip,
                  permission: Permission.AIP_RECORDS_READ,
                },
                {
                  path: "/aip-search",
                  Component: IndexSearch,
                  permission: Permission.AIP_RECORDS_READ,
                },
                {
                  path: "/ingest",
                  Component: Ingest,
                  permission: Permission.BATCH_PROCESSING_WRITE,
                },
                {
                  path: "/ingest-batches",
                  Component: IngestBatchesContainer,
                  permission: Permission.BATCH_PROCESSING_READ,
                },
                {
                  path: "/ingest-routines",
                  Component: IngestRoutinesContainer,
                  permission: Permission.INGEST_ROUTINE_RECORDS_READ,
                },
                {
                  path: "/validation-profiles",
                  Component: ValidationProfilesContainer,
                  permission: Permission.VALIDATION_PROFILE_RECORDS_READ,
                },
                {
                  path: "/sip-profiles",
                  Component: SipProfilesContainer,
                  permission: Permission.SIP_PROFILE_RECORDS_READ,
                },
                {
                  path: "/logical-storage-administration",
                  Component: StorageAdministration,
                  permission: Permission.STORAGE_ADMINISTRATION_READ,
                },
                {
                  path: "/archival-storage-administration",
                  Component: ArchivalStorageAdministration,
                  permission: Permission.STORAGE_ADMINISTRATION_READ,
                },
                {
                  path: "/workflow-definitions",
                  Component: WorkflowDefinitionsContainer,
                  permission: Permission.WORKFLOW_DEFINITION_RECORDS_READ,
                },
                {
                  path: "/deletion-requests",
                  Component: DeletionRequests,
                  permission: Permission.DELETION_REQUESTS_READ,
                },
                {
                  path: "/ingest-workflows/:id",
                  Component: IngestWorkflow,
                  permission: Permission.BATCH_PROCESSING_READ,
                },
                {
                  path: "/producers",
                  Component: ProducersContainer,
                  permission: Permission.PRODUCER_RECORDS_READ,
                },
                {
                  path: "/producer-profiles",
                  Component: ProducerProfilesContainer,
                  permission: Permission.PRODUCER_PROFILE_RECORDS_READ,
                },
                {
                  path: "/search-queries",
                  Component: SearchQueries,
                  permission: Permission.AIP_QUERY_RECORDS_READ,
                },
                {
                  path: "/users",
                  Component: UsersContainer,
                  permission: Permission.USER_RECORDS_READ,
                },
                {
                  path: "/roles",
                  Component: RolesContainer,
                  permission: Permission.USER_RECORDS_READ,
                },
                {
                  path: "/formats",
                  Component: FormatsContainer,
                  permission: Permission.FORMAT_RECORDS_READ,
                },
                {
                  path: "/reports",
                  Component: ReportsContainer,
                  permission: Permission.REPORT_TEMPLATE_RECORDS_READ,
                },
                {
                  path: "/risks",
                  Component: RisksContainer,
                  permission: Permission.RISK_RECORDS_READ,
                },
                {
                  path: "/issue-dictionary",
                  Component: IssueDictionaryContainer,
                  permission: Permission.ISSUE_DEFINITIONS_READ,
                },
                {
                  path: "/tools",
                  Component: ToolsContainer,
                  permission: Permission.TOOL_RECORDS_READ,
                },
                {
                  path: "/notifications",
                  Component: NotificationsContainer,
                  permission: Permission.NOTIFICATION_RECORDS_READ,
                },
                {
                  path: "/error",
                  Component: ErrorPage,
                },
              ]),
              ({ Component, path, ...item }, key) => {
                const RenderComponent =
                  path === "/" || hasPermissions() ? Component : NoRole;
                return (
                  <Route
                    {...{
                      ...item,
                      key,
                      path,
                      render: (props) => (
                        <RenderComponent {...{ ...containerProps, ...props }} />
                      ),
                    }}
                  />
                );
              }
            )}
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
      const { user, getUser, keepAlive } = this.props;

      window.interval = setInterval(keepAlive, 270000);

      if (!isEmpty(user) && window.location.pathname !== "/error") {
        if (get(user, "id", get(user, "sub"))) {
          getUser(get(user, "id", get(user, "sub")));
        }
      }
    },
    componentWillUnmount() {
      clearInterval(window.interval);
    },
  })
)(App);
