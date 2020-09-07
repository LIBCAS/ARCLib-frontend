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
import { isAdmin, isSuperAdmin, isArchivist, isProduction } from "../utils";
import * as storage from "../utils/storage";

const { Content } = Layout;

const PageWrapper = ({
  authStyle,
  noCardStyle,
  noRoleStyle,
  className,
  style,
  mainLayoutStyle,
  menuStyle,
  history,
  breadcrumb,
  children,
  user,
  texts,
  collapsed,
  setCollapsed,
}) => {
  const menuItems = filter(
    [
      {
        url: "/users",
        label: texts.USERS,
        show: isAdmin(user) || isSuperAdmin(user),
      },
      { url: "/producers", label: texts.PRODUCERS, show: isSuperAdmin(user) },
      { url: "/producer-profiles", label: texts.PRODUCER_PROFILES, show: true },
      {
        url: "/ingest",
        label: texts.INGEST,
        show: isSuperAdmin(user) || isArchivist(user),
      },
      { url: "/ingest-routines", label: texts.INGEST_ROUTINES, show: true },
      { url: "/ingest-batches", label: texts.INGEST_BATCHES, show: true },
      {
        url: "/validation-profiles",
        label: texts.VALIDATION_PROFILES,
        show: true,
      },
      { url: "/sip-profiles", label: texts.SIP_PROFILES, show: true },
      {
        label: texts.ARCHIVAL_STORAGE,
        items: [
          {
            url: "/archival-storage-administration",
            label: texts.ARCHIVAL_STORAGE_ADMINISTRATION,
          },
          {
            url: "/logical-storage-administration",
            label: texts.LOGICAL_STORAGE_ADMINISTRATION,
          },
        ],
        show: isSuperAdmin(user),
      },
      {
        url: "/workflow-definitions",
        label: texts.WORKFLOW_DEFINITIONS,
        show: true,
      },
      {
        url: "/deletion-requests",
        label: texts.DELETION_REQUESTS,
        show: true,
      },
      { url: "/search-queries", label: texts.SEARCH_QUERIES, show: true },
      {
        url: "/aip-search",
        onClick: () => storage.set("directedFromMenu", true),
        label: texts.AIP_SEARCH,
        show: true,
      },
      {
        label: texts.PRESERVATION_PLANNING,
        items: filter(
          [
            {
              label: texts.ISSUE_DICTIONARY,
              url: "/issue-dictionary",
              show: true,
            },
            {
              label: texts.FORMATS,
              url: "/formats",
              show: true,
            },
            {
              label: texts.RISKS,
              url: "/risks",
              show: true,
            },
            {
              label: texts.TOOLS,
              url: "/tools",
              show: true,
            },
            {
              label: texts.NOTIFICATIONS,
              url: "/notifications",
              show: isSuperAdmin(user),
            },
          ],
          "show"
        ),
        show: true,
      },
      {
        url: "/reports",
        label: texts.REPORTS,
        show: isSuperAdmin(user),
      },
    ],
    "show"
  );

  return (
    <div>
      {!isProduction() && (
        <div {...{ className: "test-stripe" }}>{texts.TEST_ENVIRONMENT}</div>
      )}
      <Layout
        {...{
          className: classNames("layout", { test: !isProduction() }),
          style: mainLayoutStyle,
        }}
      >
        <SiderMenu
          {...{
            menuItems,
            collapsed,
            setCollapsed,
            className: classNames({ hidden: authStyle || noRoleStyle }),
            menuStyle,
          }}
        />
        <Layout>
          <AppHeader
            {...{
              authStyle,
              noRoleStyle,
              menuItems,
              collapsed,
              setCollapsed,
            }}
          />
          <Content
            {...{
              className: classNames(`container ${className}`, {
                test: !isProduction(),
              }),
              style,
            }}
          >
            {!noCardStyle && !authStyle ? (
              <Card
                {...{
                  title: !isEmpty(breadcrumb) ? (
                    <BreadCrumb
                      {...{
                        history,
                        items: breadcrumb,
                      }}
                    />
                  ) : (
                    ""
                  ),
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
    </div>
  );
};

export default compose(
  withRouter,
  connect(({ app: { user, language, texts } }) => ({ user, language, texts })),
  withState("collapsed", "setCollapsed", false)
)(PageWrapper);
