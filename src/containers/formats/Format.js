import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter, Route } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Detail from "../../components/formats/Detail";
import FormatDefinition from "./FormatDefinition";
import { getFormat } from "../../actions/formatActions";

const Format = ({ history, format, getFormat, texts, ...props }) => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return (
      <PageWrapper
        {...{
          breadcrumb: [
            { label: texts.FORMATS, url: "/formats" },
            { label: get(format, "formatName", texts.FORMAT) }
          ]
        }}
      >
        {format && (
          <Detail
            {...{
              history,
              texts,
              format,
              initialValues: { ...format },
              ...props
            }}
          />
        )}
      </PageWrapper>
    );
  } else {
    return format ? (
      <Route
        {...{
          path: `${match.url}/format-definition/:id`,
          render: () => <FormatDefinition {...{ texts, ...props }} />
        }}
      />
    ) : (
      <div />
    );
  }
};

export default compose(
  withRouter,
  connect(
    ({ format: { format } }) => ({
      format
    }),
    { getFormat }
  ),
  lifecycle({
    componentWillMount() {
      const { match, getFormat } = this.props;

      getFormat(match.params.id);
    }
  })
)(Format);
