import React from 'react';
import { map, get, compact } from 'lodash';

import Button from '../Button';
import Table from '../table/Table';
import { hasPermission } from '../../utils';
import { Permission } from '../../enums';

const ProducersTable = ({ history, producers, setDialog, texts }) => {
  const deleteEnabled = hasPermission(Permission.PRODUCER_RECORDS_WRITE);
  return (
    <Table
      {...{
        tableId: 'producers',
        thCells: compact([
          { label: texts.ID, field: 'id' },
          { label: texts.NAME, field: 'name' },
          { label: texts.TRANSFER_AREA_PATH, field: 'transferAreaPath' },
          deleteEnabled && { label: '', field: 'delete' },
        ]),
        items: map(producers, (item) => ({
          onClick: () => history.push(`/producers/${item.id}`),
          items: compact([
            { label: get(item, 'id', ''), field: 'id' },
            { label: get(item, 'name', ''), field: 'name' },
            { label: get(item, 'transferAreaPath', ''), field: 'transferAreaPath' },
            deleteEnabled && {
              label: (
                <Button
                  {...{
                    onClick: (e) => {
                      e.stopPropagation();
                      setDialog('ProducerDelete', { ...item });
                    },
                  }}
                >
                  {texts.DELETE}
                </Button>
              ),
              className: 'text-right',
              field: 'delete',
            },
          ]),
        })),
      }}
    />
  );
};

export default ProducersTable;
