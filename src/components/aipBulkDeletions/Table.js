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
        thCells: compact([
          { label: texts.CREATOR },
          { label: texts.PRODUCER },
          { label: texts.SIZE },
          { label: texts.DELETED },
          { label: texts.STATE },
          { label: texts.DELETE_IF_NEWER_VERSIONS_DELETED },
          { label: texts.CREATED },
          { label: texts.UPDATED },
        ]),
        items: map(aipBulkDeletions, (item) => ({
          //onClick: () => history.push(`/aip-bulk-deletions/${item.id}`),
          items: compact([
            { label: get(item, 'creator.fullName', '') },
            { label: get(item, 'producer.name', '') },
            { label: get(item, 'size', '') },
            { label: get(item, 'deletedCount', '') },
            { label: get(item, 'state', '') },
            { label: get(item, 'deleteIfNewerVersionsDeleted') ? texts.YES : texts.NO },
            { label: formatDateTime(get(item, 'created')) },
            { label: formatDateTime(get(item, 'updated')) },
          ]),
        })),
      }}
    />
  );
};

export default connect(null, { setDialog })(AipBulkDeletionTable);
