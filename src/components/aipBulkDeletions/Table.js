import React from 'react';
import { connect } from 'react-redux';
import { map, get, compact } from 'lodash';

import Table from '../table/Table';
import { setDialog } from '../../actions/appActions';
import { formatDateTime} from '../../utils';

const AipBulkDeletionTable = ({ history, aipBulkDeletions, texts }) => {
  return (
    <Table
      {...{
        tableId: 'aipBulkDeletions',
        thCells: compact([
          { label: texts.CREATOR, field: 'creator.fullName' },
          { label: texts.PRODUCER, field: 'producer.name' },
          { label: texts.SIZE, field: 'size' },
          { label: texts.DELETED, field: 'deletedCount' },
          { label: texts.STATE, field: 'state' },
          { label: texts.DELETE_IF_NEWER_VERSIONS_DELETED, field: 'deleteIfNewerVersionsDeleted' },
          { label: texts.CREATED, field: 'created' },
          { label: texts.UPDATED, field: 'updated' },
        ]),
        items: map(aipBulkDeletions, (item) => ({
          //onClick: () => history.push(`/aip-bulk-deletions/${item.id}`),
          items: compact([
            { label: get(item, 'creator.fullName', ''), field: 'creator.fullName' },
            { label: get(item, 'producer.name', ''), field: 'producer.name' },
            { label: get(item, 'size', ''), field: 'size' },
            { label: get(item, 'deletedCount', ''), field: 'deletedCount' },
            { label: get(item, 'state', ''), field: 'state' },
            { label: get(item, 'deleteIfNewerVersionsDeleted') ? texts.YES : texts.NO, field: 'deleteIfNewerVersionsDeleted' },
            { label: formatDateTime(get(item, 'created')), field: 'created' },
            { label: formatDateTime(get(item, 'updated')), field: 'updated' },
          ]),
        })),
      }}
    />
  );
};

export default connect(null, { setDialog })(AipBulkDeletionTable);
