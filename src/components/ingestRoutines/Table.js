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
        tableId: 'ingestRoutines',
        thCells: compact([
          { label: texts.NAME, field: 'name' },
          { label: texts.PRODUCER_PROFILE, field: 'producerProfileName' },
          { label: texts.TRANSFER_AREA_PATH, field: 'transferAreaPath' },
          { label: texts.CRON_EXPRESSION, field: 'cronExpression' },
          { label: texts.ACTIVE, field: 'active' },
          deleteEnabled && { label: '', field: 'delete' },
        ]),
        items: map(routines, (item) => ({
          onClick: () => history.push(`/ingest-routines/${item.id}`),
          items: compact([
            { label: get(item, 'name', ''), field: 'name' },
            { label: get(item, 'producerProfileName', ''), field: 'producerProfileName' },
            { label: get(item, 'transferAreaPath', ''), field: 'transferAreaPath' },
            { label: get(item, 'cronExpression', ''), field: 'cronExpression' },
            { label: get(item, 'active') ? texts.YES : texts.NO, field: 'active' },
            deleteEnabled && {
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
              field: 'delete',
              className: 'text-right',
            },
          ]),
        })),
      }}
    />
  );
};

export default connect(null, { setDialog })(IngestRoutineTable);
