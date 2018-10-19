import React from "react";
import { connect } from "react-redux";
import { compose, withState } from "recompose";
import { withRouter } from "react-router-dom";
import { Layout, Card } from "antd";
import { isEmpty, filter } from "lodash";
import classNames from "classnames";

import AppHeader from "./AppHeader";
import SiderMenu from "./SiderMenu";
import BreadCrumb from "./BreadCrumb";
import {
  isAdmin,
  isSuperAdmin,
  isDeletionAcknowledge,
  isArchivist
} from "../utils";

const { Content } = Layout;

const PageWrapper = ({
  authStyle,
  noCardStyle,
  noRoleStyle,
  className,
  history,
  breadcrumb,
  children,
  user,
  texts,
  collapsed,
  setCollapsed
}) => {
  const menuItems = filter(
    [
      {
        url: "/users",
        label: texts.USERS,
        show: isAdmin(user) || isSuperAdmin(user)
      },
      { url: "/producers", label: texts.PRODUCERS, show: isSuperAdmin(user) },
      { url: "/producer-profiles", label: texts.PRODUCER_PROFILES, show: true },

      {
        url: "/ingest",
        label: texts.INGEST,
        show: isSuperAdmin(user) || isArchivist(user)
      },
      { url: "/ingest-routines", label: texts.INGEST_ROUTINES, show: true },
      { url: "/ingest-batches", label: texts.INGEST_BATCHES, show: true },
      {
        url: "/validation-profiles",
        label: texts.VALIDATION_PROFILES,
        show: true
      },
      { url: "/sip-profiles", label: texts.SIP_PROFILES, show: true },

      {
        url: "/storage-administration",
        label: texts.STORAGE_ADMINISTRATION,
        show: isSuperAdmin(user)
      },
      {
        url: "/workflow-definitions",
        label: texts.WORKFLOW_DEFINITIONS,
        show: true
      },

      {
        url: "/deletion-requests",
        label: texts.DELETION_REQUESTS,
        show: isDeletionAcknowledge(user)
      },
      { url: "/search-queries", label: texts.SEARCH_QUERIES, show: true },
      { url: "/aip-search", label: texts.AIP_SEARCH, show: true }
    ],
    "show"
  );

  return (
    <Layout {...{ className: "layout" }}>
      <SiderMenu
        {...{
          menuItems,
          collapsed,
          setCollapsed,
          className: classNames({ hidden: authStyle || noRoleStyle })
        }}
      />
      <Layout>
        <AppHeader
          {...{
            authStyle,
            noRoleStyle,
            menuItems,
            collapsed,
            setCollapsed
          }}
        />
        <Content {...{ className: `container ${className}` }}>
          {!noCardStyle && !authStyle ? (
            <Card
              {...{
                title: !isEmpty(breadcrumb) ? (
                  <BreadCrumb
                    {...{
                      history,
                      items: breadcrumb
                    }}
                  />
                ) : (
                  ""
                )
              }}
            >
              {children}
            </Card>
          ) : (
            children
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default compose(
  withRouter,
  connect(({ app: { user, language, texts } }) => ({ user, language, texts })),
  withState("collapsed", "setCollapsed", false)
)(PageWrapper);
