import React from 'react';

import PrettyJSON from '../PrettyJSON';

const PrettyJSONTableCell = ({ json, id }) => (
  <PrettyJSON
    {...{
      json,
      maxLines: 5,
    }}
  />
);

export default PrettyJSONTableCell;
