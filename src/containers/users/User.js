import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle, renameProp } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Detail from "../../components/users/Detail";
import { getUser } from "../../actions/usersActions";
import { formatDateTime } from "../../utils";

const User = ({ history, user, texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        { label: texts.USERS, url: "/users" },
        { label: get(user, "username", "") }
      ]
    }}
  >
    {user && (
      <Detail
        {...{
          history,
          user,
          texts,
          initialValues: {
            username: get(user, "username", ""),
            fullName: get(user, "fullName", ""),
            created: formatDateTime(get(user, "created")),
            updated: formatDateTime(get(user, "updated")),
            producer: get(user, "producer.id", "")
          },
          ...props
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  renameProp("user", "loggedUser"),
  connect(({ users: { user } }) => ({ user }), {
    getUser
  }),
  lifecycle({
    componentWillMount() {
      const { match, getUser } = this.props;

      getUser(match.params.id);
    }
  })
)(User);
