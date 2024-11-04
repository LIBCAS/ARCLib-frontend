import React from 'react';
import { map, get, filter, compact } from 'lodash';

import Button from '../Button';
import Table from '../table/Table';
import { formatDateTime, hasPermission } from '../../utils';
import { Permission } from '../../enums';

const RelatedRisksTable = ({ texts, setDialog, formatDefinitionId, format }) => {
  const deleteEnabled = hasPermission(Permission.RISK_RECORDS_WRITE);
  return (
    <Table
      {...{
        tableId: 'relatedRisks',
        thCells: compact([
          { label: texts.CREATED, field: 'created' },
          { label: texts.UPDATED, field: 'updated' },
          { label: texts.DESCRIPTION, field: 'description' },
          deleteEnabled && { label: '', field: 'delete' },
        ]),
        items: map(
          filter(get(format, 'relatedRisks'), ({ deleted }) => !deleted),
          (item) => ({
            items: compact([
              { label: formatDateTime(get(item, 'created')), field: 'created' },
              { label: formatDateTime(get(item, 'updated')), field: 'updated' },
              { label: get(item, 'description', ''), field: 'description' },
              deleteEnabled && {
                label: (
                  <Button
                    {...{
                      onClick: (e) => {
                        e.stopPropagation();
                        setDialog('RelatedRiskDelete', {
                          id: item.id,
                          formatDefinitionId,
                          format,
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
          })
        ),
      }}
    />
  );
};

export default RelatedRisksTable;
