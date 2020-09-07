import React from "react";
import { connect } from "react-redux";
import { map } from "lodash";

import Loader from "../components/Loader";
import dialogs, { InfoOverlayDialog } from "../components/dialogs";
import { setDialog, closeDialog } from "../actions/appActions";

const Dialogs = ({
  loader,
  language,
  texts,
  infoOverlayDialog,
  loaderText,
  ...rest
}) => (
  <div>
    {loader && <Loader {...{ text: loaderText }} />}
    <div {...{ key: `dialogs-${language}` }}>
      {map(dialogs, (Dialog, key) => (
        <Dialog {...{ key, language, texts, ...rest }} />
      ))}
    </div>
    <InfoOverlayDialog {...{ ...infoOverlayDialog, language, texts }} />
  </div>
);

export default connect(
  ({
    app: { dialog: { data }, infoOverlayDialog, loader: { show, text } }
  }) => ({
    data,
    infoOverlayDialog,
    loader: show,
    loaderText: text
  }),
  {
    setDialog,
    closeDialog
  }
)(Dialogs);
