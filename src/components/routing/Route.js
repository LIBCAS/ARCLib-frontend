import React from "react";
import { Route } from "react-router-dom";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import JWTDecode from "jwt-decode";
import getTime from "date-fns/get_time";

import * as storage from "../../utils/storage";
import { tokenNotEmpty } from "../../utils";

const AuthenticatedRoute = props => {
  return <Route {...props} />;
};

export default compose(
  withRouter,
  lifecycle({
    componentWillMount() {
      const { history, location } = this.props;

      let signed = false;
      const token = storage.get("token");

      if (!tokenNotEmpty(token)) {
        signed = false;
      } else {
        try {
          const decoded = JWTDecode(token);
          const now = Math.floor(getTime(new Date()) / 1000);
          if (!decoded.exp || decoded.exp >= now) {
            signed = true;
          } else {
            signed = false;
          }
        } catch (error) {
          signed = false;
        }
      }

      if (!signed) {
        storage.remove("token");

        if (location.pathname !== "/") {
          history.replace("/");
        }
      } else if (signed && location.pathname === "/") {
        history.replace("/ingest-batches");
      }
    }
  })
)(AuthenticatedRoute);
