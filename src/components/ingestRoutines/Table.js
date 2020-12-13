import React from 'react';
import { connect } from 'react-redux';
import { map, get, compact } from 'lodash';

import Button from '../Button';
import Table from '../table/Table';
import { setDialog } from '../../actions/appActions';
import { hasPermission } from '../../utils';
import { Permission } from '../../enums';

const IngestRoutineTable = ({ history, routines, setDialog, texts, user }) => {
  const deleteEnabled = hasPermission(Permission.INGEST_ROUTINE_RECORDS_WRITE);
  return (
    <Table
      {...{
        thCells: compact([
          { label: texts.NAME },
          { label: texts.PRODUCER_PROFILE },
          { label: texts.TRANSFER_AREA_PATH },
          { label: texts.CRON_EXPRESSION },
          { label: texts.ACTIVE },
          deleteEnabled ? { label: '' } : null,
        ]),
        items: map(routines, (item) => ({
          onClick: () => history.push(`/ingest-routines/${item.id}`),
          items: compact([
            { label: get(item, 'name', '') },
            { label: get(item, 'producerProfileName', '') },
            { label: get(item, 'transferAreaPath', '') },
            { label: get(item, 'cronExpression', '') },
            { label: get(item, 'active') ? texts.YES : texts.NO },
            deleteEnabled
              ? {
                  label: (
                    <Button
                      {...{
                        onClick: (e) => {
                          e.stopPropagation();
                          setDialog('IngestRoutineDelete', {
                            id: item.id,
                            name: item.name,
                          });
                        },
                      }}
                    >
                      {texts.DELETE}
                    </Button>
                  ),
                  className: 'text-right',
                }
              : null,
          ]),
        })),
      }}
    />
  );
};

export default connect(null, { setDialog })(IngestRoutineTable);
