import React from 'react';
import { map, get, compact } from 'lodash';

import Button from '../Button';
import Table from '../table/Table';
import { formatDateTime, hasPermission } from '../../utils';
import { Permission } from '../../enums';

const RisksTable = ({ history, risks, texts, setDialog }) => {
  const deleteEnabled = hasPermission(Permission.RISK_RECORDS_WRITE);
  return (
    <Table
      {...{
        tableId: 'risks',
        thCells: compact([
          { label: texts.CREATED, field: 'created' },
          { label: texts.UPDATED, field: 'updated' },
          { label: texts.NAME, field: 'name' },
          { label: texts.DESCRIPTION, field: 'description' },
          deleteEnabled && { label: '', field: 'delete' },
        ]),
        items: map(risks, (item) => ({
          onClick: () => history.push(`/risks/${item.id}`),
          items: compact([
            { label: formatDateTime(get(item, 'created')), field: 'created' },
            { label: formatDateTime(get(item, 'updated')), field: 'updated' },
            { label: get(item, 'name', ''), field: 'name' },
            { label: get(item, 'description', ''), field: 'description' },
            deleteEnabled && {
              label: (
                <Button
                  {...{
                    onClick: (e) => {
                      e.stopPropagation();
                      setDialog('RiskDelete', {
                        id: item.id,
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

export default RisksTable;
