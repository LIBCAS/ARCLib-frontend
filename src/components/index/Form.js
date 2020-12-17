import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import Button from '../Button';
import ConfirmButton from '../ConfirmButton';
import { setDialog } from '../../actions/appActions';
import {
  indexCore,
  indexFormat,
  indexFormatDefinition,
  indexArclibXML,
} from '../../actions/indexActions';

const Form = ({
  texts,
  setDialog,
  indexCore,
  indexFormat,
  indexFormatDefinition,
  indexArclibXML,
}) => {
  const onClick = async (callback) => {
    const ok = await callback();

    if (ok) {
      setTimeout(() => {
        setDialog('Info', {
          content: (
            <h3>
              <strong>{texts.REINDEX_STARTED}</strong>
            </h3>
          ),
          autoClose: true,
        });
      }, 200);
    }
  };

  return (
    <div {...{ className: 'flex-row flex-centered' }}>
      {[
        { label: texts.REINDEX_CORE, onClick: () => onClick(indexCore) },
        { label: texts.REINDEX_FORMAT, onClick: () => onClick(indexFormat) },
        { label: texts.REINDEX_FORMAT_DEFINITION, onClick: () => onClick(indexFormatDefinition) },
      ].map(({ label, ...button }) => (
        <Button
          {...{
            key: label,
            className: 'margin-left-small margin-right-small',
            ...button,
          }}
        >
          {label}
        </Button>
      ))}
      <ConfirmButton
        {...{
          label: texts.REINDEX_ARCLIB_XML,
          title: texts.REINDEX_ARCLIB_XML,
          text: texts.REINDEX_ARCLIB_XML_TEXT,
          onClick: () => onClick(indexArclibXML),
        }}
      />
    </div>
  );
};

export default compose(
  connect(null, {
    setDialog,
    indexCore,
    indexFormat,
    indexFormatDefinition,
    indexArclibXML,
  })
)(Form);
