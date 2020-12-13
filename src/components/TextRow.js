import React from 'react';

import PrettyJSON from './PrettyJSON';
import PrettyXML from './PrettyXML';

const TextRow = ({ label, text, notEmpty, prettyJSON, prettyXML }) =>
  !notEmpty || (text && text !== '') ? (
    <div {...{ className: 'text-row' }}>
      <p>{label}: </p>
      {prettyJSON ? (
        <PrettyJSON {...{ json: text }} />
      ) : prettyXML ? (
        <PrettyXML {...{ xml: text }} />
      ) : (
        <p>{text}</p>
      )}
    </div>
  ) : (
    <div />
  );

export default TextRow;
