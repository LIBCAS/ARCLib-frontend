import React from 'react';
import { map, get } from 'lodash';

import Table from '../table/Table';

const DevelopersTable = ({ developers, texts }) => (
  <Table
    {...{
      thCells: [
        { label: texts.DEVELOPER_ID },
        { label: texts.DEVELOPER_NAME },
        { label: texts.DEVELOPER_COUMPOUND_NAME },
        { label: texts.ORGANISATION_NAME },
        { label: texts.INTERNAL_VERSION_NUMBER },
      ],
      items: map(developers, (item) => ({
        items: [
          { label: get(item, 'developerId', '') },
          { label: get(item, 'developerName', '') },
          { label: get(item, 'developerCompoundName', '') },
          { label: get(item, 'organisationName', '') },
          { label: get(item, 'internalVersionNumber', '') },
        ],
      })),
    }}
  />
);

export default DevelopersTable;
