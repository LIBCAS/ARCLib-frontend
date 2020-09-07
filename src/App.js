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
import ValidationProfilesContainer from "./containers/validationProfiles/ValidationProfilesContainer";
import WorkflowDefinitionsContainer from "./containers/workflowDefinitions/WorkflowDefinitionsContainer";
import ReportsContainer from "./containers/reports/ReportsContainer";
import Route from "./components/routing/Route";
import { getUser, keepAlive } from "./actions/userActions";
import {
  isAdmin,
  isSuperAdmin,
  isArchivist,
  isEditor,
  hasRoles,
} from "./utils";

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
              [
                {
                  path: "/",
                  render: (props) => (
                    <Authentication {...{ ...containerProps, ...props }} />
                  ),
                  exact: true,
                  show: true,
                },
                {
                  path: "/aip/edit/:id",
                  render: (props) => (
                    <AipEditor {...{ ...containerProps, ...props }} />
                  ),
                  show: isSuperAdmin(user) || isEditor(user),
                },
                {
                  path: "/aip/:id",
                  render: (props) => (
                    <Aip {...{ ...containerProps, ...props }} />
                  ),
                  show: true,
                },
                {
                  path: "/aip-search",
                  render: (props) => (
                    <IndexSearch {...{ ...containerProps, ...props }} />
                  ),
                  show: true,
                },
                {
                  path: "/ingest",
                  render: (props) => (
                    <Ingest {...{ ...containerProps, ...props }} />
                  ),
                  show: isSuperAdmin(user) || isArchivist(user),
                },
                {
                  path: "/ingest-batches",
                  render: (props) => (
                    <IngestBatchesContainer
                      {...{ ...containerProps, ...props }}
                    />
                  ),
                  show: true,
                },
                {
                  path: "/ingest-routines",
                  render: (props) => (
                    <IngestRoutinesContainer
                      {...{ ...containerProps, ...props }}
                    />
                  ),
                  show: true,
                },
                {
                  path: "/validation-profiles",
                  render: (props) => (
                    <ValidationProfilesContainer
                      {...{ ...containerProps, ...props }}
                    />
                  ),
                  show: true,
                },
                {
                  path: "/sip-profiles",
                  render: (props) => (
                    <SipProfilesContainer
                      {...{ ...containerProps, ...props }}
                    />
                  ),
                  show: true,
                },
                {
                  path: "/logical-storage-administration",
                  render: (props) => (
                    <StorageAdministration
                      {...{ ...containerProps, ...props }}
                    />
                  ),
                  show: isSuperAdmin(user),
                },
                {
                  path: "/archival-storage-administration",
                  render: (props) => (
                    <ArchivalStorageAdministration
                      {...{ ...containerProps, ...props }}
                    />
                  ),
                  show: isSuperAdmin(user),
                },
                {
                  path: "/workflow-definitions",
                  render: (props) => (
                    <WorkflowDefinitionsContainer
                      {...{ ...containerProps, ...props }}
                    />
                  ),
                  show: true,
                },
                {
                  path: "/deletion-requests",
                  render: (props) => (
                    <DeletionRequests {...{ ...containerProps, ...props }} />
                  ),
                  show: true,
                },
                {
                  path: "/ingest-workflows/:id",
                  render: (props) => (
                    <IngestWorkflow {...{ ...containerProps, ...props }} />
                  ),
                  show: true,
                },
                {
                  path: "/producers",
                  render: (props) => (
                    <ProducersContainer {...{ ...containerProps, ...props }} />
                  ),
                  show: isSuperAdmin(user),
                },
                {
                  path: "/producer-profiles",
                  render: (props) => (
                    <ProducerProfilesContainer
                      {...{ ...containerProps, ...props }}
                    />
                  ),
                  show: true,
                },
                {
                  path: "/search-queries",
                  render: (props) => (
                    <SearchQueries {...{ ...containerProps, ...props }} />
                  ),
                  show: true,
                },
                {
                  path: "/users",
                  render: (props) => (
                    <UsersContainer {...{ ...containerProps, ...props }} />
                  ),
                  show: isAdmin(user) || isSuperAdmin(user),
                },
                {
                  path: "/formats",
                  render: (props) => (
                    <FormatsContainer {...{ ...containerProps, ...props }} />
                  ),
                  show: true,
                },
                {
                  path: "/reports",
                  render: (props) => (
                    <ReportsContainer {...{ ...containerProps, ...props }} />
                  ),
                  show: isSuperAdmin(user),
                },
                {
                  path: "/risks",
                  render: (props) => (
                    <RisksContainer {...{ ...containerProps, ...props }} />
                  ),
                  show: true,
                },
                {
                  path: "/issue-dictionary",
                  render: (props) => (
                    <IssueDictionaryContainer
                      {...{ ...containerProps, ...props }}
                    />
                  ),
                  show: true,
                },
                {
                  path: "/tools",
                  render: (props) => (
                    <ToolsContainer {...{ ...containerProps, ...props }} />
                  ),
                  show: true,
                },
                {
                  path: "/notifications",
                  render: (props) => (
                    <NotificationsContainer
                      {...{ ...containerProps, ...props }}
                    />
                  ),
                  show: isSuperAdmin(user),
                },
                {
                  path: "/error",
                  render: (props) => (
                    <ErrorPage {...{ ...containerProps, ...props }} />
                  ),
                  show: true,
                },
              ],
              ({ show, render, path, ...item }, key) =>
                show && (
                  <Route
                    {...{
                      ...item,
                      key,
                      path,
                      render:
                        path === "/" || hasRoles(user)
                          ? render
                          : (props) => (
                              <NoRole {...{ ...containerProps, ...props }} />
                            ),
                    }}
                  />
                )
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
