import React from 'react';
import { map, get } from 'lodash';

import Table from '../table/Table';

const DevelopersTable = ({ developers, texts }) => (
  <Table
    {...{
      tableId: 'developers',
      thCells: [
        { label: texts.DEVELOPER_ID, field: 'developerId' },
        { label: texts.DEVELOPER_NAME, field: 'developerName' },
        { label: texts.DEVELOPER_COUMPOUND_NAME, field: 'developerCompoundName' },
        { label: texts.ORGANISATION_NAME, field: 'organisationName' },
        { label: texts.INTERNAL_VERSION_NUMBER, field: 'internalVersionNumber' },
      ],
      items: map(developers, (item) => ({
        items: [
          { label: get(item, 'developerId', ''), field: 'developerId' },
          { label: get(item, 'developerName', ''), field: 'developerName' },
          { label: get(item, 'developerCompoundName', ''), field: 'developerCompoundName' },
          { label: get(item, 'organisationName', ''), field: 'organisationName' },
          { label: get(item, 'internalVersionNumber', ''), field: 'internalVersionNumber' },
        ],
      })),
    }}
  />
);

export default DevelopersTable;
