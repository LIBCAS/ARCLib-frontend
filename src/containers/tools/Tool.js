import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { get } from "lodash";
import { withRouter } from "react-router-dom";

import PageWrapper from "../../components/PageWrapper";
import Detail from "../../components/tools/Detail";
import { getTool } from "../../actions/toolActions";

const Tool = ({ history, tool, getTool, texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        { label: texts.TOOLS, url: "/tools" },
        { label: get(tool, "name", "") }
      ]
    }}
  >
    {tool && (
      <Detail
        {...{
          history,
          texts,
          tool,
          initialValues: tool,
          ...props
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ tool: { tool } }) => ({
      tool
    }),
    { getTool }
  ),
  lifecycle({
    componentWillMount() {
      const { match, getTool } = this.props;

      getTool(match.params.id);
    }
  })
)(Tool);
