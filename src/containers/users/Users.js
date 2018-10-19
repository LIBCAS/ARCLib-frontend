import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import Button from "../../components/Button";
import PageWrapper from "../../components/PageWrapper";
import SortOrder from "../../components/filter/SortOrder";
import Table from "../../components/users/Table";
import Pagination from "../../components/Pagination";
import { getUsers } from "../../actions/usersActions";
import { getProducers } from "../../actions/producerActions";
import { setDialog } from "../../actions/appActions";
import { isSuperAdmin } from "../../utils";

const Users = ({
  history,
  getUsers,
  users,
  setDialog,
  getProducers,
  texts,
  user
}) => (
  <PageWrapper {...{ breadcrumb: [{ label: texts.USERS }] }}>
    <Button
      {...{
        primary: true,
        className: "margin-bottom-small",
        onClick: () => {
          if (isSuperAdmin(user)) {
            getProducers(false);
          }

          setDialog("UserNew");
        }
      }}
    >
      {texts.NEW}
    </Button>
    <SortOrder
      {...{
        className: "margin-bottom",
        sortOptions: [
          { label: texts.USERNAME, value: "username" },
          { label: texts.CREATED, value: "created" },
          { label: texts.UPDATED, value: "updated" },
          { label: texts.PRODUCER, value: "producerName" }
        ],
        handleUpdate: () => getUsers()
      }}
    />
    <Table
      {...{
        history,
        setDialog,
        texts,
        users: get(users, "items"),
        handleUpdate: () => getUsers()
      }}
    />
    <Pagination
      {...{
        handleUpdate: () => getUsers(),
        count: get(users, "items.length", 0),
        countAll: get(users, "count", 0)
      }}
    />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ users: { users } }) => ({ users }), {
    getUsers,
    setDialog,
    getProducers
  }),
  lifecycle({
    componentDidMount() {
      const { getUsers } = this.props;

      getUsers();
    }
  })
)(Users);
