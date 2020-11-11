import React from "react";
import { connect } from "react-redux";
import { compose, withState } from "recompose";
import { withRouter } from "react-router-dom";
import { Layout, Card } from "antd";
import { isEmpty } from "lodash";
import classNames from "classnames";

import AppHeader from "./AppHeader";
import SiderMenu from "./SiderMenu";
import BreadCrumb from "./BreadCrumb";
import { isProduction, filterByPermission, hasPermissions } from "../utils";
import * as storage from "../utils/storage";
import { Permission } from "../enums";

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
  texts,
  collapsed,
  setCollapsed,
}) => {
  const menuItems = filterByPermission([
    {
      url: "/users",
      label: texts.USERS,
      permission: Permission.USER_RECORDS_READ,
    },
    {
      url: "/roles",
      label: texts.ROLES,
      permission: Permission.USER_RECORDS_READ,
    },
    {
      url: "/producers",
      label: texts.PRODUCERS,
      permission: Permission.PRODUCER_RECORDS_READ,
    },
    {
      url: "/producer-profiles",
      label: texts.PRODUCER_PROFILES,
      permission: Permission.PRODUCER_RECORDS_READ,
    },
    {
      url: "/ingest",
      label: texts.INGEST,
      permission: Permission.BATCH_PROCESSING_WRITE,
    },
    {
      url: "/ingest-routines",
      label: texts.INGEST_ROUTINES,
      permission: Permission.INGEST_ROUTINE_RECORDS_READ,
    },
    {
      url: "/ingest-batches",
      label: texts.INGEST_BATCHES,
      permission: Permission.BATCH_PROCESSING_READ,
    },
    {
      url: "/validation-profiles",
      label: texts.VALIDATION_PROFILES,
      permission: Permission.VALIDATION_PROFILE_RECORDS_READ,
    },
    {
      url: "/sip-profiles",
      label: texts.SIP_PROFILES,
      permission: Permission.SIP_PROFILE_RECORDS_READ,
    },
    {
      label: texts.ARCHIVAL_STORAGE,
      items: filterByPermission([
        {
          url: "/archival-storage-administration",
          label: texts.ARCHIVAL_STORAGE_ADMINISTRATION,
          permission: Permission.STORAGE_ADMINISTRATION_READ,
        },
        {
          url: "/logical-storage-administration",
          label: texts.LOGICAL_STORAGE_ADMINISTRATION,
          permission: Permission.STORAGE_ADMINISTRATION_READ,
        },
      ]),
    },
    {
      url: "/workflow-definitions",
      label: texts.WORKFLOW_DEFINITIONS,
      permission: Permission.WORKFLOW_DEFINITION_RECORDS_READ,
    },
    {
      url: "/deletion-requests",
      label: texts.DELETION_REQUESTS,
      permission: Permission.DELETION_REQUESTS_READ,
    },
    {
      url: "/search-queries",
      label: texts.SEARCH_QUERIES,
      permission: Permission.AIP_QUERY_RECORDS_READ,
    },
    {
      url: "/aip-search",
      onClick: () => storage.set("directedFromMenu", true),
      label: texts.AIP_SEARCH,
      permission: Permission.AIP_RECORDS_READ,
    },
    {
      label: texts.PRESERVATION_PLANNING,
      items: filterByPermission([
        {
          label: texts.ISSUE_DICTIONARY,
          url: "/issue-dictionary",
          permission: Permission.ISSUE_DEFINITIONS_READ,
        },
        {
          label: texts.FORMATS,
          url: "/formats",
          permission: Permission.FORMAT_RECORDS_READ,
        },
        {
          label: texts.RISKS,
          url: "/risks",
          permission: Permission.RISK_RECORDS_READ,
        },
        {
          label: texts.TOOLS,
          url: "/tools",
          permission: Permission.TOOL_RECORDS_READ,
        },
        {
          label: texts.NOTIFICATIONS,
          url: "/notifications",
          permission: Permission.NOTIFICATION_RECORDS_READ,
        },
      ]),
    },
    {
      url: "/reports",
      label: texts.REPORTS,
      permission: Permission.REPORT_TEMPLATE_RECORDS_READ,
    },
  ]);

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
        {hasPermissions() ? (
          <SiderMenu
            {...{
              menuItems,
              collapsed,
              setCollapsed,
              className: classNames({ hidden: authStyle || noRoleStyle }),
              menuStyle,
            }}
          />
        ) : (
          <div />
        )}
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
  connect(({ app: { language, texts } }) => ({ language, texts })),
  withState("collapsed", "setCollapsed", false)
)(PageWrapper);
