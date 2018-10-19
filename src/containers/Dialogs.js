import React from "react";
import { connect } from "react-redux";
import { map } from "lodash";

import Loader from "../components/Loader";
import dialogs from "../components/dialogs";
import { setDialog, closeDialog } from "../actions/appActions";

const Dialogs = ({ loader, language, ...rest }) => (
  <div>
    {loader && <Loader />}
    <div {...{ key: `dialogs-${language}` }}>
      {map(dialogs, (Dialog, key) => (
        <Dialog {...{ key, language, ...rest }} />
      ))}
    </div>
  </div>
);

export default connect(
  ({ app: { dialog: { data }, loader: { show } } }) => ({ data, loader: show }),
  {
    setDialog,
    closeDialog
  }
)(Dialogs);
